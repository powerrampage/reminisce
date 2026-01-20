import { writable } from 'svelte/store';
import { storage } from '../utils/storage';
import type { NormalizedResponse } from '../types';

const CACHE_KEY = 'reminisce-dictionary-cache';

interface CacheStore {
	[key: string]: NormalizedResponse | null;
}

function createCacheStore() {
	const stored = storage.get<CacheStore>(CACHE_KEY) || {};
	const { subscribe, set, update } = writable<CacheStore>(stored);

	let currentCache: CacheStore = stored;
	subscribe((value) => {
		currentCache = value;
	});

	return {
		subscribe,
		get: (word: string): NormalizedResponse | null | undefined => {
			return currentCache[word.toLowerCase()];
		},
		set: (word: string, data: NormalizedResponse | null): void => {
			update((cache) => {
				const newCache = { ...cache, [word.toLowerCase()]: data };
				storage.set(CACHE_KEY, newCache);
				return newCache;
			});
		},
		clear: (): void => {
			set({});
			storage.remove(CACHE_KEY);
		}
	};
}

export const cacheStore = createCacheStore();
