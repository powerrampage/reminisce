<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import Header from './components/Header.svelte';

	let { children } = $props();

	let currentPath = $derived($page.url.pathname);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Reminisce - Vocabulary Learning</title>
	<meta name="description" content="Minimal, accessible vocabulary learning app" />
</svelte:head>

<div class="min-h-screen bg-slate-900 text-slate-50">
	<Header currentPath={currentPath} />

	<main class="container mx-auto px-4 py-8">
		{@render children()}
	</main>
</div>