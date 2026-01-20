<script lang="ts">
	import Button from '$lib/ui/Button.svelte';

	interface Props {
		currentIndex: number;
		totalCards: number;
		isFlipped: boolean;
		onPrevious: () => void;
		onNext: () => void;
		onFlip: () => void;
		onShuffle: () => void;
	}

	let {
		currentIndex,
		totalCards,
		isFlipped,
		onPrevious,
		onNext,
		onFlip,
		onShuffle
	}: Props = $props();
</script>

<div class="flex items-center justify-between mb-4">
	<div class="text-slate-400 text-sm">
		Card {currentIndex + 1} of {totalCards}
	</div>
	<Button onclick={onShuffle} variant="default" class="text-sm">
		Shuffle
	</Button>
</div>

<div class="flex items-center justify-between gap-4 mb-4">
	<Button onclick={onPrevious} variant="default">
		← Previous
	</Button>

	<Button onclick={onFlip} variant="primary">
		{isFlipped ? 'Show Front' : 'Show Back'}
	</Button>

	<Button onclick={onNext} variant="default">
		Next →
	</Button>
</div>

