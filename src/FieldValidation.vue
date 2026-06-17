<template>
	<div ref="root" :class="{ invalid: error }">
		<slot :invalid="!!error" :error_message="error"></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, type PropType } from 'vue';
import { type FormValidator } from './FormValidator';
import { isUndefined, remove } from 'lodash-es';
import type { ValidationRule } from './FieldValidator';

export default defineComponent({
	name: 'FieldValidation',
	props: {
		el: {
			type: String,
			default: 'button, input, select, textarea',
		},
		group: String,
		hideError: Boolean,
		name: {
			type: String,
			required: true,
		},
		replaceRules: {
			type: Boolean,
		},
		rules: {
			type: Array as PropType<ValidationRule[]>,
			default() {
				return [];
			},
		},
		validator: {
			type: Object as PropType<FormValidator>,
			required: true,
		},
		value: {
			type: null,
		},
		watchValue: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			form_fields: [] as HTMLElement[],
		};
	},
	computed: {
		field() {
			return this.validator.fields[this.name]!;
		},
		error() {
			if (this.field && this.field.errors.length) {
				return this.field.errors[0];
			}
			return null;
		},
	},
	watch: {
		value: {
			handler(new_value) {
				if (this.watchValue) {
					this.field?.setTouched();
				}
				this.field?.setValue(new_value);
			},
			deep: true,
			immediate: true,
		},
	},
	methods: {
		validate(event: FocusEvent) {
			const root = this.$refs.root as HTMLElement;
			if (!root.contains(event.relatedTarget as Node)) {
				this.validator.setTouched();
				if (this.validator.fields.hasOwnProperty(this.name)) {
					const field = this.validator.fields[this.name]!;
					if (field.group) {
						const group_name = field.group;
						this.validator.groups[group_name as string]?.setTouched();
					}
					field.setTouched();
					field.validate();
				}
			}
		},
	},
	mounted() {
		// Add the field to the validator
		let group = this.group;

		if (!isUndefined(this.value)) {
			this.validator.addField(this.name, ref(this.value), this.rules || [], {
				replace_rules: this.replaceRules || false,
				group,
			});
		}

		nextTick(() => {
			// Add control elements to the validation methods
			const root = this.$refs.root as HTMLElement;
			const form_fields = root.querySelectorAll<HTMLElement>(this.el);
			this.form_fields = Array.from(form_fields);
			this.form_fields.forEach((form_field) => {
				if (form_field.getAttribute('has-validation') !== 'true') {
					this.validator.fields[this.name]?.controls.push(form_field);
					form_field.addEventListener('blur', this.validate);
					form_field.setAttribute('has-validation', 'true');
				}
			});
		});
	},
	beforeUnmount() {
		this.form_fields.forEach((form_field) => {
			if (form_field.getAttribute('has-validation') === 'true') {
				form_field.removeEventListener('blur', this.validate);
				form_field.removeAttribute('has-validation');
			}
			if (this.validator?.fields[this.name]?.controls?.includes(form_field)) {
				remove(this.validator?.fields[this.name]!.controls, form_field);
			}
		});
	},
});
</script>
