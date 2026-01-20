<script lang="ts">
	import type { NormalizedResponse } from '$lib/types';
	import Card from '$lib/ui/Card.svelte';
	import WordHeader from './WordHeader.svelte';
	import WordDefinitions from './WordDefinitions.svelte';
	import WordVocabulary from './WordVocabulary.svelte';
	import WordSentences from './WordSentences.svelte';

	interface Props {
		wordData: NormalizedResponse;
		isSaved: boolean;
		isSaving: boolean;
		onSave: () => void;
	}

	let { wordData, isSaved, isSaving, onSave }: Props = $props();
</script>

<Card>
	<WordHeader
		wordData={wordData}
		isSaved={isSaved}
		isSaving={isSaving}
		onSave={onSave}
	/>

	<WordDefinitions definitions={wordData.definitions} />

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6">
		<WordVocabulary words={wordData.words} />
		<WordSentences sentences={wordData.sentences} />
	</div>
</Card>

