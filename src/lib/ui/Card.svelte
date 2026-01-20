<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = '', children }: Props & { children?: import('svelte').Snippet } = $props();
</script>

<div
	class="bg-slate-950 rounded-lg p-6 border border-slate-800 shadow-lg {className}"
>
	{#if children}
		{@render children()}
	{/if}
</div>
