import { reactive, ref, type Reactive, type Ref } from 'vue';
import { forIn, isUndefined } from 'lodash-es';
import {
	useFieldValidator,
	type FieldValidator,
	type FieldValidatorConfig,
	type FieldValidatorOptions,
	type ValidationRule,
} from './FieldValidator';
import { asyncForEach } from 'modern-async';
import { useFieldValidatorGroup, type FieldValidatorGroup } from './FieldValidatorGroup';

export interface FormValidator {
	dirty: Ref<boolean, boolean>;
	fields: Reactive<Record<string, FieldValidator>>;
	groups: Reactive<Record<string, FieldValidatorGroup>>;
	touched: Ref<boolean, boolean>;
	validated: Ref<boolean, boolean>;
	addField: (
		field_name: string,
		value?: Ref<any, any> | Reactive<any>,
		rules?: Reactive<ValidationRule[]>,
		options?: FieldValidatorOptions,
	) => void;
	removeField: (field_name: string) => void;
	validate: (group_name?: string) => Promise<boolean>;
	isValid: (group_name?: string) => boolean;
	setTouched: () => void;
	reset: (group_name?: string) => void;
}

export type FormValidatorConfig = Record<string, FieldValidatorConfig>;

export function useFormValidator(config?: FormValidatorConfig) {
	const dirty = ref(false);
	const fields: Reactive<Record<string, FieldValidator>> = reactive({});
	const groups: Reactive<Record<string, FieldValidatorGroup>> = reactive({});
	const touched = ref(false);
	const validated = ref(false);

	// Add a new field to the validator
	function addField(
		field_name: string,
		value?: Ref<any, any> | Reactive<any>,
		rules?: Reactive<ValidationRule[]>,
		options?: FieldValidatorOptions,
	) {
		// Check if the field already exists
		const existing_field = fields[field_name];
		if (existing_field) {
			// Append or replace rules
			if (rules && rules.length > 0) {
				if (options?.replace_rules) {
					existing_field.replaceRules(rules);
				} else {
					existing_field.appendRules(rules);
				}
			}

			// Add to a group
			if (options?.group) {
				if (!groups[options?.group]) {
					groups[options?.group] = useFieldValidatorGroup();
				}
				groups[options?.group]!.fields[field_name] = existing_field;
				existing_field.group = options?.group;
			}
		} else {
			if (!isUndefined(value)) {
				const new_field = useFieldValidator(field_name, value, rules || [], validator);
				fields[field_name] = new_field;

				if (options?.group) {
					// Create a new group if one doesn't exist
					if (!groups[options?.group]) {
						groups[options?.group] = useFieldValidatorGroup();
					}
					groups[options?.group]!.fields[field_name] = new_field;
				}
			}
		}
	}

	// Remove a field from the validator
	function removeField(field_name: string) {
		if (fields[field_name]!.group) {
			delete groups[fields[field_name]!.group]!.fields[field_name];
		}
		delete fields[field_name];
	}

	// Validate all fields or a group of fields
	async function validate(group_name?: string) {
		if (group_name && groups[group_name]) {
			const group = groups[group_name];

			await asyncForEach(Object.keys(group.fields), async (field) => {
				await group.fields[field]!.validate();
			});

			groups[group_name].validated.value = true;
		} else {
			await asyncForEach(Object.keys(fields), async (field) => {
				await fields[field]!.validate();
			});
			validated.value = true;
		}

		return isValid();
	}

	// Return errors for all fields and groups
	function getErrors() {
		const output: Record<string, string[]> = {
			all: [],
		};

		Object.keys(groups).forEach((group_name) => {
			const group = groups[group_name];
			if (group) {
				const group_errors: string[] = [];
				Object.keys(group.fields).forEach((field) => {
					if (group.fields[field]!.errors.length > 0) {
						group_errors.push(...group.fields[field]!.errors);
					}
				});
				if (group_errors.length > 0) {
					output[group_name] = group_errors;
				}
			}
		});

		Object.keys(fields).forEach((field_name) => {
			if (fields[field_name]!.errors.length > 0) {
				output.all!.push(...fields[field_name]!.errors);
			}
		});

		return output;
	}

	// Return TRUE if all fields in the validator are valid
	function isValid(group_name?: string) {
		let field_names = Object.keys(fields);
		if (group_name) {
			field_names = Object.keys(groups[group_name]!.fields);
		}

		return field_names.every((field) => {
			return fields[field]!.errors.length === 0;
		});
	}

	function setTouched() {
		touched.value = true;
	}

	// Reset the state of the validator
	function reset(group_name?: string) {
		dirty.value = false;
		touched.value = false;
		validated.value = false;

		if (group_name && groups[group_name]) {
			groups[group_name].reset();
			forIn(groups[group_name]!.fields, (field) => {
				field.reset();
			});
		} else {
			forIn(fields, (field) => {
				field.reset();
			});
		}
	}

	const validator = {
		dirty,
		fields,
		groups,
		touched,
		validated,
		addField,
		removeField,
		validate,
		isValid,
		getErrors,
		setTouched,
		reset,
	};

	if (config) {
		forIn(config, (field_config, field_name) => {
			addField(field_name, field_config.value, field_config.rules, {
				group: field_config.group,
			});
		});
	}

	return validator;
}
