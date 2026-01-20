<script lang="ts">
	import type { NormalizedResponse } from '$lib/types';

	interface Props {
		definitions: NormalizedResponse['definitions'];
	}

	let { definitions }: Props = $props();
</script>

{#if definitions && definitions.length > 0}
	<div class="mb-4">
		<div class="space-y-2">
			{#each definitions as def}
				<div>
					<p class="text-xs text-slate-500 uppercase mb-1">{def.partOfSpeech}</p>
					<ul class="list-disc list-inside space-y-1">
						{#each def.definitions as definition}
							<li class="text-slate-300 text-sm">{definition}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
{/if}

