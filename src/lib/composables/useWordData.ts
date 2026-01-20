import { fetchWord } from '$lib/services/russian';
import type { NormalizedResponse } from '$lib/types';

export interface WordDataDerived {
	translation: string | null;
	definition: string | null;
	exampleSentence: { en: string; ru: string } | null;
}

export function extractWordData(data: NormalizedResponse | null): WordDataDerived {
	return {
		translation: data?.words?.length ? data.words[0].ru : null,
		definition: data?.definitions?.[0]?.definitions?.[0] || null,
		exampleSentence: data?.sentences?.[0] || null
	};
}

export async function loadWordData(word: string): Promise<{
	data: NormalizedResponse | null;
	error: string | null;
}> {
	if (!word) {
		return { data: null, error: null };
	}

	try {
		const fetchedData = await fetchWord(word);
		if (!fetchedData) {
			return { data: null, error: 'Word data not found' };
		}
		return { data: fetchedData, error: null };
	} catch {
		return { data: null, error: 'Failed to load word data' };
	}
}

