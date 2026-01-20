<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import AuthModal from './AuthModal.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { fade } from 'svelte/transition';
	import type { TransitionConfig } from 'svelte/transition';

	function slideHorizontal(node: Element, { duration = 300 }: { duration?: number } = {}): TransitionConfig {
		const style = getComputedStyle(node);
		const opacity = +style.opacity;
		const paddingRight = parseFloat(style.paddingRight);
		const paddingLeft = parseFloat(style.paddingLeft);
		const marginRight = parseFloat(style.marginRight);
		const marginLeft = parseFloat(style.marginLeft);
		const borderRightWidth = parseFloat(style.borderRightWidth);
		const borderLeftWidth = parseFloat(style.borderLeftWidth);

		return {
			duration,
			css: (t) => {
				const eased = 1 - t;
				return `
					opacity: ${t * opacity};
					transform: translateX(${eased * 100}%);
					padding-right: ${t * paddingRight}px;
					padding-left: ${t * paddingLeft}px;
					margin-right: ${t * marginRight}px;
					margin-left: ${t * marginLeft}px;
					border-right-width: ${t * borderRightWidth}px;
					border-left-width: ${t * borderLeftWidth}px;
				`;
			}
		};
	}

	let { currentPath }: { currentPath: string } = $props();

	let authModalOpen = $state(false);
	let authModalMode = $state<'login' | 'register'>('login');
	let mobileMenuOpen = $state(false);
	let authState = $state<{ user: import('@supabase/supabase-js').User | null; loading: boolean; initialized: boolean }>({ user: null, loading: true, initialized: false });

	$effect(() => {
		const unsubscribe = authStore.subscribe((auth) => {
			authState = {
				user: auth.user,
				loading: auth.loading,
				initialized: auth.initialized
			};
		});
		return unsubscribe;
	});

	async function handleSignOut() {
		try {
			await authStore.signOut();
			mobileMenuOpen = false;
		} catch (error) {
			console.error('Failed to sign out:', error);
		}
	}

	function openAuthModal(mode: 'login' | 'register' = 'login') {
		authModalMode = mode;
		authModalOpen = true;
		mobileMenuOpen = false;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function handleNavClick() {
		mobileMenuOpen = false;
	}
</script>

<nav class="border-b border-slate-800 bg-slate-950" aria-label="Main navigation">
	<div class="container mx-auto px-4 py-4">
		<div class="flex items-center justify-between">
			<a
				href="/"
				class="text-xl font-bold text-blue-600 hover:text-blue-500 focus:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded"
			>
				Reminisce
			</a>

			<div class="hidden md:flex items-center gap-4">
				<ul class="flex gap-4" role="list">
					<li>
						<a
							href="/"
							class="px-3 py-2 rounded-md transition-colors hover:bg-slate-800 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 {currentPath === '/' ? 'bg-slate-800 text-blue-400' : 'text-slate-300'}"
							aria-current={currentPath === '/' ? 'page' : undefined}
						>
							Dictionary
						</a>
					</li>
					<li>
						<a
							href="/saved"
							class="px-3 py-2 rounded-md transition-colors hover:bg-slate-800 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 {currentPath === '/saved' ? 'bg-slate-800 text-blue-400' : 'text-slate-300'}"
							aria-current={currentPath === '/saved' ? 'page' : undefined}
						>
							Saved Words
						</a>
					</li>
					<li>
						<a
							href="/flashcards"
							class="px-3 py-2 rounded-md transition-colors hover:bg-slate-800 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 {currentPath === '/flashcards' ? 'bg-slate-800 text-blue-400' : 'text-slate-300'}"
							aria-current={currentPath === '/flashcards' ? 'page' : undefined}
						>
							Flashcards
						</a>
					</li>
				</ul>

				{#if authState.loading || !authState.initialized}
					<div class="w-8 h-8 rounded-full bg-slate-700 animate-pulse" aria-hidden="true"></div>
				{:else if authState.user}
					<div class="flex items-center gap-3">
						<span class="text-sm text-slate-400 hidden lg:inline">
							{authState.user.email}
						</span>
						<Button onclick={handleSignOut} variant="default" class="text-sm">
							Sign Out
						</Button>
					</div>
				{:else}
					<div class="flex items-center gap-2">
						<Button onclick={() => openAuthModal('login')} variant="default" class="text-sm">
							Sign In
						</Button>
						<Button onclick={() => openAuthModal('register')} variant="primary" class="text-sm">
							Sign Up
						</Button>
					</div>
				{/if}
			</div>

			<button
				type="button"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				class="md:hidden p-2 rounded-md text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
				aria-label="Toggle menu"
				aria-expanded={mobileMenuOpen}
			>
				{#if mobileMenuOpen}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				{:else}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				{/if}
			</button>
		</div>
	</div>
</nav>

{#if mobileMenuOpen}
	<div
		class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
		onclick={closeMobileMenu}
		transition:fade={{ duration: 200 }}
		role="presentation"
		aria-hidden="true"
	></div>

	<aside
		class="fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-slate-950 border-l border-slate-800 shadow-xl md:hidden"
		role="navigation"
		aria-label="Navigation menu"
		transition:slideHorizontal={{ duration: 300 }}
	>
		<div class="flex flex-col h-full">
			<div class="flex items-center justify-between p-4 border-b border-slate-800">
				<h2 class="text-lg font-semibold text-slate-50">Menu</h2>
				<button
					type="button"
					onclick={closeMobileMenu}
					class="p-2 rounded-md text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
					aria-label="Close menu"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<nav class="flex-1 overflow-y-auto p-4">
				<ul class="space-y-2" role="list">
					<li>
						<a
							href="/"
							onclick={handleNavClick}
							class="block px-4 py-3 rounded-md transition-colors hover:bg-slate-800 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 {currentPath === '/' ? 'bg-slate-800 text-blue-400' : 'text-slate-300'}"
							aria-current={currentPath === '/' ? 'page' : undefined}
						>
							Dictionary
						</a>
					</li>
					<li>
						<a
							href="/saved"
							onclick={handleNavClick}
							class="block px-4 py-3 rounded-md transition-colors hover:bg-slate-800 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 {currentPath === '/saved' ? 'bg-slate-800 text-blue-400' : 'text-slate-300'}"
							aria-current={currentPath === '/saved' ? 'page' : undefined}
						>
							Saved Words
						</a>
					</li>
					<li>
						<a
							href="/flashcards"
							onclick={handleNavClick}
							class="block px-4 py-3 rounded-md transition-colors hover:bg-slate-800 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 {currentPath === '/flashcards' ? 'bg-slate-800 text-blue-400' : 'text-slate-300'}"
							aria-current={currentPath === '/flashcards' ? 'page' : undefined}
						>
							Flashcards
						</a>
					</li>
				</ul>
			</nav>

			<div class="p-4 border-t border-slate-800 space-y-3">
				{#if authState.loading || !authState.initialized}
					<div class="flex items-center justify-center py-4">
						<div class="w-8 h-8 rounded-full bg-slate-700 animate-pulse" aria-hidden="true"></div>
					</div>
				{:else if authState.user}
					<div class="space-y-3">
						<div class="px-4 py-2 text-sm text-slate-400 break-all">
							{authState.user.email}
						</div>
						<Button onclick={handleSignOut} variant="default" class="w-full">
							Sign Out
						</Button>
					</div>
				{:else}
					<div class="space-y-2">
						<Button onclick={() => openAuthModal('login')} variant="default" class="w-full">
							Sign In
						</Button>
						<Button onclick={() => openAuthModal('register')} variant="primary" class="w-full">
							Sign Up
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</aside>
{/if}

<AuthModal bind:isOpen={authModalOpen} bind:mode={authModalMode} />
