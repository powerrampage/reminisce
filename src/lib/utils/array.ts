export function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

export function createShuffledIndices(length: number): number[] {
	if (length === 0) return [];
	return shuffleArray(Array.from({ length }, (_, i) => i));
}

export function getNextIndex(currentIndex: number, arrayLength: number): number {
	if (arrayLength === 0) return 0;
	return (currentIndex + 1) % arrayLength;
}

export function getPreviousIndex(currentIndex: number, arrayLength: number): number {
	if (arrayLength === 0) return 0;
	return currentIndex === 0 ? arrayLength - 1 : currentIndex - 1;
}

