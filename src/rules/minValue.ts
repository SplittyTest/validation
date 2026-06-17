export default function (min_value: number, message?: string) {
	return function (value: any) {
		if (typeof value !== 'undefined' && value >= min_value) {
			return null;
		}
		return message || `Value must be at least ${min_value}`;
	};
}
