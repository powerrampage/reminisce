<script lang="ts">
	interface Props {
		onclick?: () => void;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		variant?: 'primary' | 'accent' | 'default';
		class?: string;
	}

	let {
		onclick,
		type = 'button',
		disabled = false,
		variant = 'default',
		class: className = '',
		children
	}: Props & { children?: import('svelte').Snippet } = $props();

	// Variant styles
	const variantClasses = {
		primary: 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white',
		accent: 'bg-green-600 hover:bg-green-700 focus:bg-green-700 text-white',
		default: 'bg-slate-700 hover:bg-slate-600 focus:bg-slate-600 text-slate-50'
	};
</script>

<button
	type={type}
	onclick={onclick}
	disabled={disabled}
	class="px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed {variantClasses[variant]} {className}"
>
	{#if children}
		{@render children()}
	{/if}
</button>
