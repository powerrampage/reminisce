const DICTIONARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export interface DictionaryPhonetic {
	text?: string;
	audio?: string;
}

export interface DictionaryDefinition {
	definition: string;
	synonyms?: string[];
	antonyms?: string[];
	example?: string;
}

export interface DictionaryMeaning {
	partOfSpeech: string;
	definitions: DictionaryDefinition[];
	synonyms?: string[];
	antonyms?: string[];
}

export interface DictionaryResponse {
	word: string;
	phonetics: DictionaryPhonetic[];
	meanings: DictionaryMeaning[];
}

async function fetchWithProxy(url: string): Promise<unknown> {
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: { 'Accept': 'application/json' },
			mode: 'cors'
		});
		if (!response.ok) {
			throw new Error('Request failed');
		}
		return await response.json();
	} catch (error) {
		throw new Error('Network error', { cause: error });
	}
}

export async function fetchPhonetic(word: string): Promise<{ text?: string; audio?: string; definitions?: Array<{ partOfSpeech: string; definitions: string[] }> } | null> {
	if (!word || word.trim().length === 0) {
		return null;
	}

	try {
		const url = `${DICTIONARY_API_BASE}/${encodeURIComponent(word.trim().toLowerCase())}`;
		const data = await fetchWithProxy(url) as DictionaryResponse[];

		if (!data || !Array.isArray(data) || data.length === 0) {
			return null;
		}

		const firstEntry = data[0];
		let phoneticText: string | undefined;
		let phoneticAudio: string | undefined;

		if (firstEntry.phonetics && firstEntry.phonetics.length > 0) {
			const phoneticWithAudio = firstEntry.phonetics.find(p => p.audio && p.text);
			const phonetic = phoneticWithAudio || firstEntry.phonetics.find(p => p.audio) || firstEntry.phonetics.find(p => p.text) || firstEntry.phonetics[0];
			phoneticText = phonetic.text;
			phoneticAudio = phonetic.audio;
		}

		const definitions = firstEntry.meanings?.map(meaning => ({
			partOfSpeech: meaning.partOfSpeech,
			definitions: meaning.definitions.map(def => def.definition)
		}));

		return {
			text: phoneticText,
			audio: phoneticAudio,
			definitions
		};
	} catch {
		return null;
	}
}

