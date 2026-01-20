<script lang="ts">
	import type { NormalizedResponse } from '$lib/types';

	interface Props {
		word: string;
		wordData: NormalizedResponse | null;
		isLoading: boolean;
		error: string | null;
		translation: string | null;
		definition: string | null;
		exampleSentence: { en: string; ru: string } | null;
		onWordClick: (word: string) => void;
		onFlip: () => void;
	}

	let {
		word,
		wordData,
		isLoading,
		error,
		translation,
		definition,
		exampleSentence,
		onWordClick,
		onFlip
	}: Props = $props();
</script>

<div class="h-full p-6 overflow-y-auto">
	{#if isLoading}
		<div class="flex flex-col items-center justify-center h-full space-y-4">
			<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			<p class="text-slate-400 text-sm">Loading...</p>
		</div>
	{:else if error}
		<div class="flex flex-col items-center justify-center h-full">
			<p class="text-red-400 text-sm mb-2">{error}</p>
			<p class="text-slate-400 text-xs">Try flipping again</p>
		</div>
	{:else if wordData && word}
		<div class="space-y-4">
			<div>
				<a
					href="/?q={encodeURIComponent(word)}"
					onclick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onWordClick(word);
					}}
					class="text-3xl font-bold text-blue-400 hover:text-blue-300 underline decoration-2 underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded inline-block"
					aria-label="View full details for {word}"
				>
					{word}
				</a>
			</div>

			{#if translation}
				<div>
					<h3 class="text-sm font-semibold text-slate-400 uppercase mb-2">
						Translation
					</h3>
					<p class="text-xl text-slate-200">{translation}</p>
				</div>
			{/if}

			{#if definition}
				<div>
					<h3 class="text-sm font-semibold text-slate-400 uppercase mb-2">
						Definition
					</h3>
					<p class="text-slate-300">{definition}</p>
				</div>
			{/if}

			{#if exampleSentence}
				<div>
					<h3 class="text-sm font-semibold text-slate-400 uppercase mb-2">
						Example
					</h3>
					<div class="space-y-2">
						<p class="text-slate-200 italic">"{exampleSentence.en}"</p>
						<p class="text-slate-400 italic">"{exampleSentence.ru}"</p>
					</div>
				</div>
			{/if}

			{#if !translation && !definition && !exampleSentence}
				<p class="text-slate-400 text-sm">No additional information available</p>
			{/if}

			<div class="pt-4 mt-4 border-t border-slate-800">
				<button
					type="button"
					onclick={onFlip}
					class="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
					aria-label="Flip card to front"
				>
					Flip to Front
				</button>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center h-full">
			<p class="text-slate-400 text-sm">No data available</p>
		</div>
	{/if}
</div>

