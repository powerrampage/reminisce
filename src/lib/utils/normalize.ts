import type { WordData, SentenceData, NormalizedResponse } from "../types";
import type { OpenRussianResponse } from "$lib/types/open-russian";

function removeSimilarWords(words: string[]) {
	return [...new Set(words)];
}

function removeExtraQuotes(text: string) {
	return text.replace(/'/g, '');
}

export function normalizeResponse({ result }: OpenRussianResponse): NormalizedResponse | undefined {
	if(result.words.length === 0) return;

	const words: WordData[] = [];
	const sentences: SentenceData[] = [];

	result.sentences.forEach(({ ru, tl }) => {
		sentences.push({ ru: removeExtraQuotes(ru), en: tl })
	})

	result.words.forEach(({ word }) => {
		words.push({
			ru: removeExtraQuotes(word.ru),
			type: word.type,
			enWords: removeSimilarWords(word.tls2.flatMap(({ translation }) => translation)) ,
			examples: word.tls2.flatMap(({ examples }) => ({
				en: examples.map(({ translated }) => translated),
				ru: examples.map(({ native }) => removeExtraQuotes(native))
			})),
		})
	})

	return {
		term: result.term,
		words,
		sentences
	}
}