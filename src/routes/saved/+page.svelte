<script lang="ts">
	import { wordsStore, type SavedWord } from '$lib/stores/words';
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import Button from '$lib/ui/Button.svelte';
	import Card from '$lib/ui/Card.svelte';
	import AuthModal from '../components/AuthModal.svelte';

	let savedWords = $state<SavedWord[]>([]);
	let isLoading = $state(true);
	let authState = $state<{ user: import('@supabase/supabase-js').User | null; loading: boolean; initialized: boolean }>({ user: null, loading: true, initialized: false });
	let authModalOpen = $state(false);
	let hasLoadedOnce = $state(false);

	$effect(() => {
		const unsubscribeAuth = authStore.subscribe((auth) => {
			authState = {
				user: auth.user,
				loading: auth.loading,
				initialized: auth.initialized
			};
			if (auth.initialized && !auth.loading && auth.user && !hasLoadedOnce) {
				// Only refresh once when page loads and user is authenticated
				hasLoadedOnce = true;
				loadWords();
			} else if (auth.initialized && !auth.loading && !auth.user) {
				savedWords = [];
				isLoading = false;
				hasLoadedOnce = false;
			}
		});
		return unsubscribeAuth;
	});

	$effect(() => {
		const unsubscribeWords = wordsStore.subscribe((words) => {
			savedWords = words;
			// Update loading state when words are loaded
			if (hasLoadedOnce && authState.initialized && !authState.loading) {
				isLoading = false;
			}
		});
		return unsubscribeWords;
	});

	async function loadWords() {
		isLoading = true;
		try {
			await wordsStore.refresh();
		} catch (error) {
			console.error('Failed to load saved words:', error);
		} finally {
			isLoading = false;
		}
	}

	async function handleRemove(word: string) {
		if (confirm(`Remove "${word}" from saved words?`)) {
			try {
				await wordsStore.removeWord(word);
			} catch (error) {
				console.error('Failed to remove word:', error);
				alert('Failed to remove word. Please try again.');
			}
		}
	}

	function handleOpenFlashcard(word: string) {
		goto(`/flashcards?word=${encodeURIComponent(word)}`);
	}
</script>

<div class="max-w-3xl mx-auto">
	<h1 class="text-3xl font-bold mb-8 text-center">Saved Words</h1>

	{#if authState.loading || !authState.initialized}
		<Card>
			<div class="text-center py-12">
				<p class="text-slate-400">Loading...</p>
			</div>
		</Card>
	{:else if !authState.user}
		<Card>
			<div class="text-center py-12">
				<p class="text-slate-400 mb-4">Please sign in to view your saved words</p>
				<Button onclick={() => (authModalOpen = true)} variant="primary">
					Sign In
				</Button>
			</div>
		</Card>
	{:else if isLoading}
		<Card>
			<div class="text-center py-12">
				<p class="text-slate-400">Loading saved words...</p>
			</div>
		</Card>
	{:else if savedWords.length === 0}
		<Card>
			<div class="text-center py-12">
				<p class="text-slate-400 mb-4">No saved words yet</p>
				<a
					href="/"
					class="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 font-medium text-white!"
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

<AuthModal bind:isOpen={authModalOpen} />
