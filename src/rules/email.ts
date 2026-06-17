export default function (message?: string) {
	return function (value: string) {
		const pattern =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (typeof value !== 'undefined' && pattern.test(value)) {
			return null;
		}
		return message || 'Please enter a valid email address';
	};
}
