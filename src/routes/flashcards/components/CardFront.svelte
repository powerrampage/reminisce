<script lang="ts">
	interface Props {
		word: string;
		isLoading: boolean;
	}

	let { word, isLoading }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center h-full text-center p-6">
	{#if isLoading}
		<div class="space-y-4">
			<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			<p class="text-slate-400 text-sm">Loading...</p>
		</div>
	{:else if word}
		<h2 class="text-4xl font-bold mb-6">{word}</h2>
		<p class="text-sm text-slate-500">
			Press Space or Enter to flip
		</p>
	{:else}
		<p class="text-slate-400">No word available</p>
	{/if}
</div>

