<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		audioUrl?: string;
		class?: string;
	}

	let { audioUrl, class: className = '' }: Props = $props();

	let audio: HTMLAudioElement | null = $state(null);
	let isPlaying = $state(false);
	let isLoading = $state(false);

	onMount(() => {
		if (audioUrl) {
			audio = new Audio(audioUrl);
			audio.addEventListener('ended', () => {
				isPlaying = false;
			});
			audio.addEventListener('error', () => {
				isLoading = false;
				isPlaying = false;
			});
		}

		return () => {
			if (audio) {
				audio.pause();
				audio = null;
			}
		};
	});

	function handleClick() {
		if (!audio || !audioUrl) return;

		if (isPlaying) {
			audio.pause();
			isPlaying = false;
		} else {
			isLoading = true;
			audio
				.play()
				.then(() => {
					isPlaying = true;
					isLoading = false;
				})
				.catch((error) => {
					isLoading = false;
				});
		}
	}
</script>

{#if audioUrl}
	<button
		type="button"
		onclick={handleClick}
		disabled={isLoading}
		aria-label={isPlaying ? 'Stop pronunciation' : 'Play pronunciation'}
		class="p-2 rounded-md bg-slate-700 hover:bg-slate-600 focus:bg-slate-600 text-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed {className}"
	>
		{#if isLoading}
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
		{:else if isPlaying}
			<svg
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
			</svg>
		{:else}
			<svg
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path d="M8 5v14l11-7z" />
			</svg>
		{/if}
	</button>
{/if}
