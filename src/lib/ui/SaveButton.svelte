<script lang="ts">
	interface Props {
		onclick?: () => void;
		disabled?: boolean;
		isSaved?: boolean;
		isSaving?: boolean;
		class?: string;
	}

	let {
		onclick,
		disabled = false,
		isSaved = false,
		isSaving = false,
		class: className = ''
	}: Props = $props();
</script>

<button
	type="button"
	onclick={onclick}
	disabled={disabled || isSaving}
	aria-label={isSaved ? 'Word already saved' : 'Save word'}
	class="p-2 rounded-md bg-slate-700 hover:bg-slate-600 focus:bg-slate-600 text-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed {isSaved ? 'text-green-400' : 'text-slate-50'} {className}"
>
	{#if isSaving}
		<svg
			class="w-5 h-5 animate-spin"
			fill="none"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<circle
				class="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	{:else if isSaved}
		<svg
			class="w-5 h-5"
			fill="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
			/>
		</svg>
	{:else}
		<svg
			class="w-5 h-5"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
			/>
		</svg>
	{/if}
</button>
