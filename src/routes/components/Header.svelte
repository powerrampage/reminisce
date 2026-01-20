<script lang="ts">
	let { currentPath }: { currentPath: string } = $props();
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
		</div>
	</div>
</nav>

