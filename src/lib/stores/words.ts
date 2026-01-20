import { writable } from 'svelte/store';
import { storage } from '../utils/storage';

const WORDS_KEY = 'reminisce-saved-words';

export interface SavedWord {
	word: string;
}

function createWordsStore() {
	const stored = storage.get<SavedWord[]>(WORDS_KEY) || [];
	const { subscribe, set, update } = writable<SavedWord[]>(stored);

	return {
		subscribe,
		addWord: (word: string): void => {
			if (!word) return;
			update((words) => {
				const exists = words.some((w) => w.word && w.word.toLowerCase() === word.toLowerCase());
				if (exists) {
					return words;
				}

				const newWord: SavedWord = {
					word: word
				};

				const newWords = [...words, newWord];
				storage.set(WORDS_KEY, newWords);
				return newWords;
			});
		},
		removeWord: (word: string): void => {
			if (!word) return;
			update((words) => {
				const newWords = words.filter(
					(w) => w.word && w.word.toLowerCase() !== word.toLowerCase()
				);
				storage.set(WORDS_KEY, newWords);
				return newWords;
			});
		},
		getWord: (word: string): SavedWord | undefined => {
			if (!word) return undefined;
			let found: SavedWord | undefined;
			update((words) => {
				found = words.find((w) => w.word && w.word.toLowerCase() === word.toLowerCase());
				return words;
			});
			return found;
		},
		getAll: (): SavedWord[] => {
			let all: SavedWord[] = [];
			update((words) => {
				all = words;
				return words;
			});
			return all;
		},
		clear: (): void => {
			set([]);
			storage.remove(WORDS_KEY);
		}
	};
}

export const wordsStore = createWordsStore();
