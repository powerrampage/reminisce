<script lang="ts">
	import Card from '$lib/ui/Card.svelte';

	interface Props {
		message: string;
	}

	let { message }: Props = $props();
</script>

<Card>
	<div class="text-center py-8">
		<p class="text-red-400">{message}</p>
	</div>
</Card>

