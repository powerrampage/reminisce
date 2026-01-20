import type { SavedWord } from '$lib/stores/words';
import { createShuffledIndices, getNextIndex, getPreviousIndex } from '$lib/utils/array';

export class CardNavigation {
	private words: SavedWord[];
	private shuffledIndices: number[];
	private getCurrentIndex: () => number;
	private setCurrentIndex: (value: number) => void;

	constructor(
		words: SavedWord[],
		getCurrentIndex: () => number,
		setCurrentIndex: (value: number) => void
	) {
		this.words = words;
		this.shuffledIndices = createShuffledIndices(words.length);
		this.getCurrentIndex = getCurrentIndex;
		this.setCurrentIndex = setCurrentIndex;
	}

	getCurrentWord(): SavedWord | undefined {
		const currentIndex = this.getCurrentIndex();
		if (this.shuffledIndices.length === 0 || currentIndex >= this.shuffledIndices.length) {
			return undefined;
		}
		return this.words[this.shuffledIndices[currentIndex]];
	}

	getShuffledIndices(): number[] {
		return this.shuffledIndices;
	}

	next(): void {
		if (this.shuffledIndices.length === 0) return;
		const currentIndex = this.getCurrentIndex();
		this.setCurrentIndex(getNextIndex(currentIndex, this.shuffledIndices.length));
	}

	previous(): void {
		if (this.shuffledIndices.length === 0) return;
		const currentIndex = this.getCurrentIndex();
		this.setCurrentIndex(getPreviousIndex(currentIndex, this.shuffledIndices.length));
	}

	shuffle(): void {
		if (this.words.length === 0) return;
		this.shuffledIndices = createShuffledIndices(this.words.length);
		this.setCurrentIndex(0);
	}

	findWordIndex(word: string): void {
		if (!word || this.shuffledIndices.length === 0) return;
		
		const index = this.words.findIndex(
			(w) => w.word.toLowerCase() === word.toLowerCase()
		);
		
		if (index !== -1) {
			const shuffledIndex = this.shuffledIndices.findIndex((i) => i === index);
			if (shuffledIndex !== -1) {
				this.setCurrentIndex(shuffledIndex);
			}
		}
	}

	updateWords(newWords: SavedWord[]): void {
		this.words = newWords;
		if (newWords.length !== this.shuffledIndices.length) {
			this.shuffledIndices = createShuffledIndices(newWords.length);
			const currentIndex = this.getCurrentIndex();
			if (currentIndex >= newWords.length && newWords.length > 0) {
				this.setCurrentIndex(0);
			}
		}
	}
}

