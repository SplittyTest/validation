export default function (min_length: number, message?: string) {
	return function (value: any) {
		let trimmed_value = value;
		if (typeof value === 'string') {
			trimmed_value = value.trim();
		}
		if (typeof trimmed_value !== 'undefined' && trimmed_value.length >= min_length) {
			return null;
		}
		return message || `Value must be at least ${min_length} characters`;
	};
}
