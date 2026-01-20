import type { NormalizedResponse } from '$lib/types';
import type { OpenRussianResponse } from '$lib/types/open-russian';
import { normalizeResponse } from '$lib/utils/normalize';
import { fetchPhonetic } from './dictionary';
import { cacheStore } from '../stores/cache';

const RUSSIAN_API_BASE = 'https://api.openrussian.org/suggestions';

async function fetchApi(url: string): Promise<OpenRussianResponse> {
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: { 'Accept': 'application/json' },
		});
		if (!response.ok) {
			throw new Error('Request failed');
		}
		return await response.json();
	} catch (error) {
		throw new Error('Network error', { cause: error });
	}
}

export async function fetchWord(word: string): Promise<NormalizedResponse | undefined> {
	if (!word || word.trim().length === 0) return;

	const normalizedWord = word.trim().toLowerCase();
	const cached = cacheStore.get(normalizedWord);

	if (cached) return cached;

	try {
		const apiUrl = `${RUSSIAN_API_BASE}?q=${encodeURIComponent(normalizedWord)}`;
		const data = await fetchApi(apiUrl);
		const normalized = normalizeResponse(data);

		if (normalized) {
			const phonetic = await fetchPhonetic(normalizedWord);
			if (phonetic) {
				if (phonetic.audio) {
					normalized.phonetic = {
						text: phonetic.text || '',
						audio: phonetic.audio
					};
				}
				if (phonetic.definitions) {
					normalized.definitions = phonetic.definitions;
				}
			}
			cacheStore.set(normalizedWord, normalized);
		} else {
			cacheStore.set(normalizedWord, null);
		}

		return normalized;
	} catch {
		throw new Error('Failed to fetch word');
	}
}