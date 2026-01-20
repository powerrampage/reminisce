<script lang="ts">
	import type { NormalizedResponse } from '$lib/types';

	interface Props {
		words: NormalizedResponse['words'];
	}

	let { words }: Props = $props();
</script>

<div>
	<h3 class="text-sm lg:text-base font-semibold mb-2 lg:mb-3 text-blue-400">Vocabulary</h3>
	<div class="space-y-2 lg:space-y-3">
		{#each words as wordEntry}
			<div class="border-b border-slate-800 pb-2 lg:pb-3 last:border-b-0">
				<div class="flex items-start justify-between mb-1 lg:mb-2">
					<p class="text-sm lg:text-base font-semibold text-slate-200">
						{wordEntry.enWords.join(', ')}
					</p>
					<span class="text-xs text-slate-500 uppercase">{wordEntry.type}</span>
				</div>
				<div class="mb-1 lg:mb-2">
					<p class="text-slate-400 text-xs lg:text-sm">
						{wordEntry.ru}
					</p>
				</div>
				{#if wordEntry.examples.length > 0}
					<div class="mt-1 lg:mt-2 space-y-1 lg:space-y-1.5">
						{#each wordEntry.examples as example}
							<div class="text-xs text-slate-400">
								{#each example.en as enText, i}
									<p class="italic mb-0.5">"{enText}"</p>
									{#if example.ru[i]}
										<p class="text-slate-500 italic mb-1">"{example.ru[i]}"</p>
									{/if}
								{/each}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

