import type { FieldValidatorConfig } from '@/FieldValidator';
import { ref } from 'vue';
import { ZodObject, type ZodAny } from 'zod';

export function zodRule(schema: ZodAny) {
	return [
		async (value: any) => {
			try {
				const parsed = await schema.safeParseAsync(value);
				if (parsed.success) {
					return null;
				}
				return parsed.error.issues[0]?.message;
			} catch (err: any) {
				return err.message;
			}
		},
	];
}

export function zodSchema(schema: ZodObject) {
	const formatted_schema: Record<string, FieldValidatorConfig> = {};
	const fields = Object.keys(schema.shape);
	fields.forEach((field_name) => {
		formatted_schema[field_name] = {
			value: ref(null),
			rules: zodRule(schema.shape[field_name]),
		};
	});
	return formatted_schema;
}
