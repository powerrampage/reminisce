<script lang="ts">
	import { wordsStore, type SavedWord } from '$lib/stores/words';
	import { goto } from '$app/navigation';
	import Button from '$lib/ui/Button.svelte';
	import Card from '$lib/ui/Card.svelte';

	let savedWords = $state<SavedWord[]>([]);

	$effect(() => {
		const unsubscribe = wordsStore.subscribe((words) => {
			savedWords = words;
		});
		return unsubscribe;
	});

	function handleRemove(word: string) {
		if (confirm(`Remove "${word}" from saved words?`)) {
			wordsStore.removeWord(word);
		}
	}

	function handleOpenFlashcard(word: string) {
		goto(`/flashcards?word=${encodeURIComponent(word)}`);
	}
</script>

<div class="max-w-3xl mx-auto">
	<h1 class="text-3xl font-bold mb-8 text-center">Saved Words</h1>

	{#if savedWords.length === 0}
		<Card>
			<div class="text-center py-12">
				<p class="text-slate-400 mb-4">No saved words yet</p>
				<a
					href="/"
					class="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 font-medium"
				>
					Search for words
				</a>
			</div>
		</Card>
	{:else}
		<ul class="space-y-4" role="list">
			{#each savedWords as savedWord}
				<Card>
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1 min-w-0">
							<h2 class="text-xl font-bold mb-1 truncate">{savedWord.word}</h2>
						</div>
						<div class="flex gap-2 shrink-0">
							<Button
								onclick={() => handleOpenFlashcard(savedWord.word)}
								variant="primary"
							>
								Open Flashcard
							</Button>
							<Button
								onclick={() => handleRemove(savedWord.word)}
								variant="default"
							>
								Remove
							</Button>
						</div>
					</div>
				</Card>
			{/each}
		</ul>
	{/if}
</div>
