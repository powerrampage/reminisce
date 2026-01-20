import { wordsStore } from '$lib/stores/words';
import type { NormalizedResponse } from '$lib/types';

export function useSaveWord(getWordData: () => NormalizedResponse | null) {
	let isSaving = $state(false);

	const isSaved = $derived(() => {
		const data = getWordData();
		if (!data?.term) return false;
		return !!wordsStore.getWord(data.term);
	});

	async function save(): Promise<void> {
		const data = getWordData();
		if (!data?.term) return;

		isSaving = true;
		wordsStore.addWord(data.term);

		await new Promise((resolve) => setTimeout(resolve, 500));
		isSaving = false;
	}

	return {
		get isSaving() {
			return isSaving;
		},
		get isSaved() {
			return isSaved;
		},
		save
	};
}

