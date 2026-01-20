<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { wordsStore, type SavedWord } from '$lib/stores/words';
	import type { NormalizedResponse } from '$lib/types';
	import { CardNavigation } from '$lib/composables/useCardNavigation';
	import { loadWordData, extractWordData } from '$lib/composables/useWordData';
	import { createKeyboardHandler } from '$lib/composables/useKeyboardNavigation';
	import FlashcardContainer from './components/FlashcardContainer.svelte';
	import NavigationControls from './components/NavigationControls.svelte';
	import EmptyState from './components/EmptyState.svelte';

	let savedWords = $state<SavedWord[]>([]);
	let currentIndex = $state(0);
	let shuffledIndices = $state<number[]>([]);
	let navigation = $state<CardNavigation | null>(null);
	let isFlipped = $state(false);
	let wordData = $state<NormalizedResponse | null>(null);
	let isLoadingWord = $state(false);
	let error = $state<string | null>(null);

	let currentWord = $derived(navigation?.getCurrentWord());
	let hasWords = $derived(savedWords.length > 0);
	let wordDataExtracted = $derived(extractWordData(wordData));

	$effect(() => {
		if (savedWords.length > 0) {
			if (!navigation) {
				navigation = new CardNavigation(
					savedWords,
					() => currentIndex,
					(value) => { currentIndex = value; }
				);
				shuffledIndices = navigation.getShuffledIndices();
			} else {
				navigation.updateWords(savedWords);
				shuffledIndices = navigation.getShuffledIndices();
			}
		} else {
			navigation = null;
			currentIndex = 0;
			shuffledIndices = [];
		}
	});

	$effect(() => {
		const wordParam = $page.url.searchParams.get('word');
		if (wordParam && navigation) {
			navigation.findWordIndex(wordParam);
		}
	});

	$effect(() => {
		if (!currentWord?.word) {
			wordData = null;
			error = null;
			isLoadingWord = false;
			return;
		}

		isFlipped = false;
		isLoadingWord = true;
		error = null;

		loadWordData(currentWord.word)
			.then(({ data, error: err }) => {
				wordData = data;
				error = err;
			})
			.finally(() => {
				isLoadingWord = false;
			});
	});

	function handleFlip() {
		isFlipped = !isFlipped;
	}

	function handleNext() {
		navigation?.next();
	}

	function handlePrevious() {
		navigation?.previous();
	}

	function handleShuffle() {
		navigation?.shuffle();
		isFlipped = false;
		wordData = null;
		error = null;
	}

	function handleWordClick(word: string) {
		goto(`/?q=${encodeURIComponent(word)}`);
	}

	const handleKeydown = createKeyboardHandler({
		onFlip: () => {
			if (hasWords) handleFlip();
		},
		onNext: () => {
			if (hasWords) handleNext();
		},
		onPrevious: () => {
			if (hasWords) handlePrevious();
		}
	});

	onMount(() => {
		const unsubscribe = wordsStore.subscribe((words) => {
			savedWords = words;
		});
		return unsubscribe;
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="max-w-2xl mx-auto">
	<h1 class="text-3xl font-bold mb-8 text-center">Flashcards</h1>

	{#if !hasWords}
		<EmptyState />
	{:else if navigation}
		<NavigationControls
			currentIndex={currentIndex}
			totalCards={shuffledIndices.length}
			isFlipped={isFlipped}
			onPrevious={handlePrevious}
			onNext={handleNext}
			onFlip={handleFlip}
			onShuffle={handleShuffle}
		/>

		<div class="mb-6">
			<FlashcardContainer
				isFlipped={isFlipped}
				word={currentWord?.word}
				wordData={wordData}
				isLoading={isLoadingWord}
				error={error}
				translation={wordDataExtracted.translation}
				definition={wordDataExtracted.definition}
				exampleSentence={wordDataExtracted.exampleSentence}
				onFlip={handleFlip}
				onWordClick={handleWordClick}
			/>
		</div>

		<div class="text-center mt-6 text-xs text-slate-500 space-y-1">
			<p>Space / Enter: Flip card</p>
			<p>← → : Navigate cards</p>
		</div>
	{/if}
</div>
