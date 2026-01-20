import { wordsStore } from '$lib/stores/words';
import { authStore } from '$lib/stores/auth';
import type { NormalizedResponse } from '$lib/types';

export function useSaveWord(getWordData: () => NormalizedResponse | null) {
	let isSaving = $state(false);
	let isSaved = $state(false);
	let authState = $state({ user: null, loading: true, initialized: false });

	// Subscribe to auth state
	$effect(() => {
		const unsubscribe = authStore.subscribe((auth) => {
			authState = {
				user: auth.user,
				loading: auth.loading,
				initialized: auth.initialized
			};
		});
		return unsubscribe;
	});

	// Check if word is saved
	$effect(() => {
		const data = getWordData();
		if (!data?.term || !authState.user || authState.loading) {
			isSaved = false;
			return;
		}

		wordsStore.getWord(data.term).then((saved) => {
			isSaved = !!saved;
		});
	});

	async function save(): Promise<void> {
		const data = getWordData();
		if (!data?.term) return;

		if (!authState.user) {
			throw new Error('Please sign in to save words');
		}

		isSaving = true;
		try {
			await wordsStore.addWord(data.term);
			isSaved = true;
		} catch (error) {
			console.error('Failed to save word:', error);
			throw error;
		} finally {
			isSaving = false;
		}
	}

	return {
		get isSaving() {
			return isSaving;
		},
		get isSaved() {
			return isSaved;
		},
		get isAuthenticated() {
			return !!authState.user && authState.initialized && !authState.loading;
		},
		save
	};
}
