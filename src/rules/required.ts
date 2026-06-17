import { isEmpty, isNull, isUndefined, merge } from 'lodash-es';

export interface RequiredRuleOptions {
	allow_false?: boolean;
	max?: number;
	min?: number;
}

export default function (message?: string, options?: RequiredRuleOptions) {
	const merged_options = merge(
		{
			min: 1,
			max: Infinity,
		},
		options || {},
	);

	return function (value: any) {
		let valid = false;
		switch (typeof value) {
			case 'string':
				if (value.length > 0) {
					valid = true;
				}
				break;
			case 'number':
				if (value >= merged_options.min && value <= merged_options.max) {
					valid = true;
				}
				break;
			case 'boolean':
				if (merged_options.allow_false) {
					if (!isUndefined(value) && !isNull(value)) {
						valid = true;
					}
				} else {
					if (value !== false) {
						valid = true;
					}
				}
				break;
			case 'object':
				if (Array.isArray(value)) {
					if (value.length > 0) {
						valid = true;
					}
				} else if (!isEmpty(value)) {
					valid = true;
				}
				break;
			default:
				if (!isUndefined(value) && !isNull(value)) {
					valid = true;
				}
				break;
		}

		if (!valid) {
			return message || 'This field is required';
		}
		return null;
	};
}
