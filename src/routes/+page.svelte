<script lang="ts">
	import { useUrlSearch } from '$lib/composables/useUrlSearch.svelte';
	import { useSearch } from '$lib/composables/useSearch.svelte';
	import { useSaveWord } from '$lib/composables/useSaveWord.svelte';
	import { authStore } from '$lib/stores/auth';
	import SearchBar from './components/SearchBar.svelte';
	import LoadingState from './components/LoadingState.svelte';
	import ErrorState from './components/ErrorState.svelte';
	import EmptyState from './components/EmptyState.svelte';
	import WordDetails from './components/WordDetails.svelte';
	import AuthModal from './components/AuthModal.svelte';

	let searchInput = $state('');
	let previousUrlParam = $state<string | null>(null);
	let saveError = $state<string | null>(null);
	let authModalOpen = $state(false);

	const urlSearch = useUrlSearch();
	const search = useSearch();
	const saveWord = useSaveWord(() => search.data);

	async function handleSearch() {
		const word = searchInput.trim();
		urlSearch.setSearchParam(word);
		await search.search(word);
	}

	function handleInput(value: string) {
		searchInput = value;
	}

	async function handleSave() {
		saveError = null;
		try {
			await saveWord.save();
		} catch (error: any) {
			console.error('Failed to save word:', error);
			if (error.message?.includes('sign in') || error.message?.includes('authenticated')) {
				saveError = 'Please sign in to save words';
				authModalOpen = true;
			} else {
				saveError = error.message || 'Failed to save word. Please try again.';
			}
		}
	}

	$effect(() => {
		const searchParam = urlSearch.getSearchParam();
		if (searchParam !== previousUrlParam) {
			previousUrlParam = searchParam;
			if (searchParam) {
				searchInput = searchParam;
				search.search(searchParam);
			} else if (!searchParam && search.data) {
				searchInput = '';
				search.reset();
			}
		}
	});
</script>

<div class="max-w-6xl mx-auto">
	<h1 class="text-3xl font-bold mb-8 text-center">Dictionary</h1>

	<div class="mb-6">
		<SearchBar
			value={searchInput}
			isLoading={search.isLoading}
			onInput={handleInput}
			onSearch={handleSearch}
		/>
	</div>

	{#if saveError}
		<div
			class="mb-4 p-3 rounded-md bg-red-900/50 border border-red-700 text-red-300"
			role="alert"
		>
			{saveError}
		</div>
	{/if}

	{#if search.isLoading}
		<LoadingState />
	{/if}

	{#if search.error && !search.isLoading}
		<ErrorState message={search.error} />
	{/if}

	{#if search.data && !search.isLoading}
		<WordDetails
			wordData={search.data}
			isSaved={saveWord.isSaved}
			isSaving={saveWord.isSaving}
			onSave={handleSave}
		/>
	{/if}

	{#if !search.data && !search.isLoading && !search.error && !searchInput}
		<EmptyState />
	{/if}
</div>

<AuthModal bind:isOpen={authModalOpen} />
