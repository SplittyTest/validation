export default function (regex_pattern: RegExp, message?: string) {
	return function (value: any) {
		const pattern = new RegExp(regex_pattern);
		if (typeof value !== 'undefined' && pattern.test(value)) {
			return null;
		}
		return message || 'Please enter a valid value';
	};
}
