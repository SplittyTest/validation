import { useFormValidator, type FormValidator, type FormValidatorConfig } from './FormValidator';
import {
	useFieldValidator,
	type FieldValidator,
	type FieldValidatorOptions,
	type FieldValidatorConfig,
	type ValidationRule,
} from './FieldValidator';
import { useFieldValidatorGroup, type FieldValidatorGroup } from './FieldValidatorGroup';
import FieldValidation from './FieldValidation.vue';
import * as rules from './rules';
import { zodRule, zodSchema } from './utils/zodValidation';

export type {
	FormValidator,
	FormValidatorConfig,
	FieldValidator,
	FieldValidatorOptions,
	FieldValidatorConfig,
	FieldValidatorGroup,
	ValidationRule,
};

export {
	useFormValidator,
	useFieldValidator,
	useFieldValidatorGroup,
	FieldValidation,
	rules,
	zodSchema,
	zodRule,
};
