export default function (match_value: any, message?: string) {
	return function (value: any) {
		if (!match_value || value === match_value) {
			return null;
		}
		return message || 'The value does not match';
	};
}
