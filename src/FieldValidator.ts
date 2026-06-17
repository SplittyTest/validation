import { asyncForEach } from 'modern-async';
import { type FormValidator } from './FormValidator';
import { reactive, ref, toValue, watch, type Reactive, type Ref } from 'vue';
import { useFieldValidatorGroup } from './FieldValidatorGroup';

export type ValidationRule = (value: any, ...args: any) => Promise<string | null> | (string | null);

export interface FieldValidatorOptions {
	replace_rules?: boolean;
	group?: string;
}

export interface FieldValidatorConfig {
	value?: Ref<any, any> | Reactive<any>;
	rules?: ValidationRule[];
	group?: string;
}

export interface FieldValidator {
	form_value: Ref<any, any>;
	controls: HTMLElement[];
	dirty: Ref<boolean, boolean>;
	errors: Reactive<string[]>;
	group?: string;
	rules: Reactive<ValidationRule[]>;
	touched: Ref<boolean, boolean>;
	validated: Ref<boolean, boolean>;
	setValue: (value: any) => void;
	replaceRules: (new_rules: ValidationRule[]) => void;
	appendRules: (new_rules: ValidationRule[]) => void;
	addToGroup: (group_name: string) => void;
	removeFromGroup: (group_name: string) => void;
	validate: () => Promise<boolean>;
	isValid: () => boolean;
	setTouched: () => void;
	reset: () => void;
}

export function useFieldValidator(
	field_name: string,
	value: Ref<any, any> | Reactive<any>,
	new_rules: ValidationRule[],
	validator: FormValidator,
	options?: FieldValidatorOptions,
) {
	const form_value: Ref<any, any> = ref(value);
	const controls: HTMLElement[] = [];
	const dirty = ref(false);
	const errors: Reactive<string[]> = reactive([]);
	const group: string | undefined = options?.group;
	const rules: Reactive<ValidationRule[]> = reactive([]);
	const touched = ref(false);
	const validated = ref(false);

	// Append or replace rules
	if (new_rules?.length > 0) {
		if (options?.replace_rules) {
			replaceRules(new_rules);
		} else {
			appendRules(new_rules);
		}
	}

	function setValue(v: any) {
		form_value.value = v;
		if (touched.value) {
			validate();
		}
	}

	// Replace all rules with new ones
	function replaceRules(new_rules: ValidationRule[]) {
		rules.splice(0, rules.length, ...new_rules);
	}

	// Append new rules
	function appendRules(new_rules: ValidationRule[]) {
		rules.push(...new_rules);
	}

	// Add to a group
	function addToGroup(group_name: string) {
		if (!validator.groups[group_name]) {
			// Create a new group
			validator.groups[group_name] = useFieldValidatorGroup();
		}
		validator.groups[group_name].fields[field_name] = field_validator;
	}

	// Remove from a group
	function removeFromGroup(group_name: string) {
		if (validator.groups[group_name]) {
			delete validator.groups[group_name].fields[field_name];
		}
	}

	async function validate() {
		// Reset the errors
		errors.splice(0, errors.length);

		// Only validate if the controls are not disabled or hidden
		let should_validate = false;
		if (
			controls.length === 0 ||
			(controls.length > 0 &&
				controls?.every((control_element) => {
					return !control_element.getAttribute('disabled');
				}))
		) {
			should_validate = true;
		}

		if (should_validate) {
			await asyncForEach(rules, async (rule: ValidationRule) => {
				const error = await rule(toValue(value));
				if (error !== null) {
					errors.push(error);
				}
			});
		}

		return isValid();
	}

	function isValid() {
		return errors.length > 0;
	}

	function setTouched() {
		touched.value = true;
	}

	// Reset the state of the validator
	function reset() {
		dirty.value = false;
		touched.value = false;
		validated.value = false;
		errors.splice(0, errors.length);
	}

	// Create an object reference for the field validator
	const field_validator = {
		form_value,
		controls,
		dirty,
		errors,
		group,
		rules,
		touched,
		validated,
		setValue,
		replaceRules,
		appendRules,
		addToGroup,
		removeFromGroup,
		validate,
		isValid,
		setTouched,
		reset,
	};

	return field_validator;
}
