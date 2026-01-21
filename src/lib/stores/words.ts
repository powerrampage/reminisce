import { writable } from 'svelte/store';
import { savedWordsService } from '../services/savedWords';
import { authStore } from './auth';
import { browser } from '$app/environment';

export interface SavedWord {
	word: string;
}

function createWordsStore() {
	const { subscribe, set } = writable<SavedWord[]>([]);
	let isLoading = false;
	let currentUserId: string | null = null;

	// Load words when user is authenticated
	if (browser) {
		authStore.subscribe((auth) => {
			if (auth.initialized && !auth.loading) {
				if (auth.user) {
					// Only load if user changed or not loaded yet
					if (auth.user.id !== currentUserId) {
						currentUserId = auth.user.id;
						loadWords();
					}
				} else {
					currentUserId = null;
					set([]);
				}
			}
		});
	}

	async function loadWords() {
		if (isLoading) return;
		isLoading = true;
		try {
			const words = await savedWordsService.getAll();
			set(words);
		} catch (error) {
			console.error('Failed to load saved words:', error);
			set([]);
		} finally {
			isLoading = false;
		}
	}

	return {
		subscribe,
		addWord: async (word: string): Promise<void> => {
			if (!word) return;
			try {
				await savedWordsService.save(word);
				await loadWords(); // Reload to sync with database
			} catch (error) {
				console.error('Failed to add word:', error);
				throw error;
			}
		},
		removeWord: async (word: string): Promise<void> => {
			if (!word) return;
			try {
				await savedWordsService.remove(word);
				await loadWords(); // Reload to sync with database
			} catch (error) {
				console.error('Failed to remove word:', error);
				throw error;
			}
		},
		getWord: async (word: string): Promise<SavedWord | undefined> => {
			if (!word) return undefined;
			try {
				const isSaved = await savedWordsService.isSaved(word);
				return isSaved ? { word: word.toLowerCase() } : undefined;
			} catch (error) {
				console.error('Failed to check word:', error);
				return undefined;
			}
		},
		getAll: async (): Promise<SavedWord[]> => {
			try {
				return await savedWordsService.getAll();
			} catch (error) {
				console.error('Failed to get all words:', error);
				return [];
			}
		},
		clear: async (): Promise<void> => {
			try {
				await savedWordsService.clear();
				set([]);
			} catch (error) {
				console.error('Failed to clear words:', error);
				throw error;
			}
		},
		refresh: loadWords
	};
}

export const wordsStore = createWordsStore();
