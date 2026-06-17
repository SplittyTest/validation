import { isNil } from 'lodash-es';

export default function (message: string) {
	return function (value: any) {
		if (!isNil(value)) {
			return null;
		}
		return message || 'This field is required';
	};
}
