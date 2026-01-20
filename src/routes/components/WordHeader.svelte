<script lang="ts">
	import type { NormalizedResponse } from '$lib/types';
	import AudioButton from '$lib/ui/AudioButton.svelte';
	import SaveButton from '$lib/ui/SaveButton.svelte';

	interface Props {
		wordData: NormalizedResponse;
		isSaved: boolean;
		isSaving: boolean;
		onSave: () => void;
	}

	let { wordData, isSaved, isSaving, onSave }: Props = $props();
</script>

<div class="flex items-start justify-between gap-4 mb-6">
	<div class="flex-1">
		<h2 class="text-2xl font-bold mb-2">{wordData.term}</h2>
		{#if wordData.phonetic?.text}
			<p class="text-slate-400 text-sm mb-2">/{wordData.phonetic.text}/</p>
		{/if}
	</div>
	<div class="flex items-center gap-2">
		{#if wordData.phonetic?.audio}
			<AudioButton audioUrl={wordData.phonetic.audio} />
		{/if}
		<SaveButton
			onclick={onSave}
			disabled={isSaving}
			isSaved={isSaved}
			isSaving={isSaving}
		/>
	</div>
</div>

