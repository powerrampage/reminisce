<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import Button from '$lib/ui/Button.svelte';
	import Card from '$lib/ui/Card.svelte';

	interface Props {
		isOpen?: boolean;
		mode?: 'login' | 'register';
		onClose?: () => void;
	}

	let {
		isOpen = $bindable(false),
		mode = $bindable('login'),
		onClose
	}: Props = $props();

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let error = $state<string | null>(null);
	let isLoading = $state(false);
	let successMessage = $state<string | null>(null);

	async function handleSubmit() {
		if (!email || !password) {
			error = 'Please fill in all fields';
			return;
		}

		if (mode === 'register' && password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		if (password.length < 6) {
			error = 'Password must be at least 6 characters';
			return;
		}

		error = null;
		isLoading = true;

		try {
			if (mode === 'login') {
				await authStore.signIn(email, password);
				successMessage = 'Successfully signed in!';
				setTimeout(() => {
					isOpen = false;
					resetForm();
				}, 1000);
			} else {
				await authStore.signUp(email, password);
				successMessage = 'Account created! Please check your email to verify your account.';
				setTimeout(() => {
					isOpen = false;
					resetForm();
				}, 2000);
			}
		} catch (err: any) {
			error = err.message || 'An error occurred';
		} finally {
			isLoading = false;
		}
	}

	function resetForm() {
		email = '';
		password = '';
		confirmPassword = '';
		error = null;
		successMessage = null;
	}

	function switchMode() {
		mode = mode === 'login' ? 'register' : 'login';
		error = null;
		successMessage = null;
	}

	function handleClose() {
		isOpen = false;
		resetForm();
		onClose?.();
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		aria-labelledby="auth-modal-title"
		onclick={(e) => {
			if (e.target === e.currentTarget) handleClose();
		}}
	>
		<Card class="w-full max-w-md mx-4">
			<div class="flex items-center justify-between mb-6">
				<h2 id="auth-modal-title" class="text-2xl font-bold">
					{mode === 'login' ? 'Sign In' : 'Create Account'}
				</h2>
				<button
					type="button"
					onclick={handleClose}
					class="p-1 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					aria-label="Close modal"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			{#if successMessage}
				<div
					class="mb-4 p-3 rounded-md bg-green-900/50 border border-green-700 text-green-300"
					role="alert"
				>
					{successMessage}
				</div>
			{/if}

			{#if error}
				<div
					class="mb-4 p-3 rounded-md bg-red-900/50 border border-red-700 text-red-300"
					role="alert"
				>
					{error}
				</div>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
				<div>
					<label for="email" class="block text-sm font-medium mb-1">Email</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						required
						autocomplete="email"
						class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="your@email.com"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium mb-1">Password</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						required
						autocomplete={mode === 'login' ? 'current-password' : 'new-password'}
						minlength="6"
						class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="••••••••"
					/>
				</div>

				{#if mode === 'register'}
					<div>
						<label for="confirm-password" class="block text-sm font-medium mb-1"
							>Confirm Password</label
						>
						<input
							id="confirm-password"
							type="password"
							bind:value={confirmPassword}
							required
							autocomplete="new-password"
							minlength="6"
							class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="••••••••"
						/>
					</div>
				{/if}

				<div class="flex flex-col gap-2">
					<Button type="submit" variant="primary" disabled={isLoading} class="w-full">
						{isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
					</Button>

					<button
						type="button"
						onclick={switchMode}
						class="text-sm text-slate-400 hover:text-slate-300 text-center"
					>
						{mode === 'login'
							? "Don't have an account? Sign up"
							: 'Already have an account? Sign in'}
					</button>
				</div>
			</form>
		</Card>
	</div>
{/if}

