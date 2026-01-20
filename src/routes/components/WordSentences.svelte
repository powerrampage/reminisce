<script lang="ts">
	import type { NormalizedResponse } from '$lib/types';

	interface Props {
		sentences: NormalizedResponse['sentences'];
	}

	let { sentences }: Props = $props();
</script>

<div>
	<h3 class="text-sm lg:text-base font-semibold mb-2 lg:mb-3 text-green-400">Example Sentences</h3>
	<div class="space-y-2 lg:space-y-3">
		{#each sentences as sentence}
			<div class="border-b border-slate-800 pb-2 lg:pb-3 last:border-b-0">
				<p class="text-slate-200 text-xs lg:text-sm mb-1 lg:mb-2">{sentence.en}</p>
				<p class="text-slate-400 text-xs lg:text-sm">{sentence.ru}</p>
			</div>
		{/each}
	</div>
</div>

