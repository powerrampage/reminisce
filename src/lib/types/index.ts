export interface WordData {
  ru: string;
  type: string;
  enWords: string[];
  examples: {
    en: string[];
    ru: string[];
  }[];
}

export interface SentenceData {
  ru: string;
  en: string;
}

export interface PhoneticData {
  text: string;
  audio: string;
}

export interface Definition {
  partOfSpeech: string;
  definitions: string[];
}

export interface NormalizedResponse {
  term: string;
  words: WordData[];
  sentences: SentenceData[];
  phonetic?: PhoneticData;
  definitions?: Definition[];
}