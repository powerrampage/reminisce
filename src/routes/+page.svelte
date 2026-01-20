<script lang="ts">
	import { useUrlSearch } from '$lib/composables/useUrlSearch.svelte';
	import { useSearch } from '$lib/composables/useSearch.svelte';
	import { useSaveWord } from '$lib/composables/useSaveWord.svelte';
	import SearchBar from './components/SearchBar.svelte';
	import LoadingState from './components/LoadingState.svelte';
	import ErrorState from './components/ErrorState.svelte';
	import EmptyState from './components/EmptyState.svelte';
	import WordDetails from './components/WordDetails.svelte';

	let searchInput = $state('');
	let previousUrlParam = $state<string | null>(null);

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
		await saveWord.save();
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

	{#if search.isLoading}
		<LoadingState />
	{/if}

	{#if search.error && !search.isLoading}
		<ErrorState message={search.error} />
	{/if}

	{#if search.data && !search.isLoading}
		<WordDetails
			wordData={search.data}
			isSaved={saveWord.isSaved()}
			isSaving={saveWord.isSaving}
			onSave={handleSave}
		/>
	{/if}

	{#if !search.data && !search.isLoading && !search.error && !searchInput}
		<EmptyState />
	{/if}
</div>