export default function (max_length: number, message?: string) {
	return function (value: any) {
		let trimmed_value = value;
		if (typeof value === 'string') {
			trimmed_value = value.trim();
		}
		if (typeof trimmed_value !== 'undefined' && trimmed_value.length <= max_length) {
			return null;
		}
		return message || `Value must not exceed ${max_length} characters`;
	};
}
