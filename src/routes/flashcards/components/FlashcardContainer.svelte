<script lang="ts">
	import Card from '$lib/ui/Card.svelte';
	import CardFront from './CardFront.svelte';
	import CardBack from './CardBack.svelte';
	import type { NormalizedResponse } from '$lib/types';

	interface Props {
		isFlipped: boolean;
		word: string | undefined;
		wordData: NormalizedResponse | null;
		isLoading: boolean;
		error: string | null;
		translation: string | null;
		definition: string | null;
		exampleSentence: { en: string; ru: string } | null;
		onFlip: () => void;
		onWordClick: (word: string) => void;
	}

	let {
		isFlipped,
		word,
		wordData,
		isLoading,
		error,
		translation,
		definition,
		exampleSentence,
		onFlip,
		onWordClick
	}: Props = $props();
</script>

<Card>
	<div
		class="relative min-h-[450px] perspective-1000"
		role="region"
		aria-label="Flashcard"
		aria-live="polite"
	>
		<button
			type="button"
			onclick={onFlip}
			class="absolute inset-0 w-full h-full backface-hidden transition-transform duration-500 {isFlipped
				? 'rotate-y-180 opacity-0 pointer-events-none'
				: 'rotate-y-0 opacity-100'}"
			aria-hidden={isFlipped}
			aria-label="Flip card to back"
		>
			<CardFront word={word || ''} isLoading={isLoading} />
		</button>

		<div
			class="absolute inset-0 backface-hidden transition-transform duration-500 {isFlipped
				? 'rotate-y-0 opacity-100'
				: 'rotate-y-180 opacity-0 pointer-events-none'}"
			aria-hidden={!isFlipped}
		>
			<CardBack
				word={word || ''}
				wordData={wordData}
				isLoading={isLoading}
				error={error}
				translation={translation}
				definition={definition}
				exampleSentence={exampleSentence}
				onWordClick={onWordClick}
				onFlip={onFlip}
			/>
		</div>
	</div>
</Card>

<style>
	.perspective-1000 {
		perspective: 1000px;
	}

	.backface-hidden {
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	.rotate-y-0 {
		transform: rotateY(0deg);
	}

	.rotate-y-180 {
		transform: rotateY(180deg);
	}
</style>

