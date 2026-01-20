import { fetchWord } from '$lib/services/russian';
import type { NormalizedResponse } from '$lib/types';

export interface SearchState {
	data: NormalizedResponse | null;
	isLoading: boolean;
	error: string | null;
}

export function useSearch() {
	let data = $state<NormalizedResponse | null>(null);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	async function search(word: string): Promise<void> {
		if (!word.trim()) {
			reset();
			return;
		}

		isLoading = true;
		error = null;

		try {
			const result = await fetchWord(word.trim());
			if (result) {
				data = result;
				error = null;
			} else {
				data = null;
				error = 'Word not found';
			}
		} catch {
			data = null;
			error = 'Failed to fetch word';
		} finally {
			isLoading = false;
		}
	}

	function reset(): void {
		data = null;
		isLoading = false;
		error = null;
	}

	return {
		get data() {
			return data;
		},
		get isLoading() {
			return isLoading;
		},
		get error() {
			return error;
		},
		search,
		reset
	};
}

