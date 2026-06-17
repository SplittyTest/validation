export default function (max_value: number, message?: string) {
	return function (value: any) {
		if (typeof value !== 'undefined' && value <= max_value) {
			return null;
		}
		return message || `Value must not exceed ${max_value}`;
	};
}
