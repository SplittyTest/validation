import { reactive, ref, type Reactive, type Ref } from 'vue';
import type { FieldValidator } from './FieldValidator';

export interface FieldValidatorGroup {
	dirty: Ref<boolean, boolean>;
	fields: Reactive<Record<string, FieldValidator>>;
	touched: Ref<boolean, boolean>;
	validated: Ref<boolean, boolean>;
	setTouched: () => void;
	reset: () => void;
}

export function useFieldValidatorGroup() {
	const dirty = ref(false);
	const fields = reactive({});
	const touched = ref(false);
	const validated = ref(false);

	function setTouched() {
		touched.value = true;
	}

	function reset() {
		dirty.value = false;
		touched.value = false;
		validated.value = false;
	}

	return {
		dirty,
		touched,
		validated,
		fields,
		setTouched,
		reset,
	};
}
