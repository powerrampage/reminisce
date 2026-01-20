<script lang="ts">
	import Button from '$lib/ui/Button.svelte';

	interface Props {
		value: string;
		isLoading: boolean;
		onInput: (value: string) => void;
		onSearch: () => void;
	}

	let { value, isLoading, onInput, onSearch }: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		onInput(target.value);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			onSearch();
		}
	}
</script>

<label for="word-input" class="block text-sm font-medium mb-2 sr-only">
	Enter word to search
</label>
<div class="flex gap-2">
	<input
		id="word-input"
		type="text"
		placeholder="Enter a word..."
		value={value}
		oninput={handleInput}
		onkeydown={handleKeydown}
		class="flex-1 px-4 py-3 rounded-md bg-slate-950 border border-slate-800 text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
		autocomplete="off"
		autocapitalize="off"
		spellcheck="false"
	/>
	<Button onclick={onSearch} disabled={isLoading} variant="primary">
		Search
	</Button>
</div>

