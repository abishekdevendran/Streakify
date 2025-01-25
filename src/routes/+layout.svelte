<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { ModeWatcher } from 'mode-watcher';
	import { getPageState, setPageState } from '$lib/stores/index.svelte';

	let { children } = $props();

	setPageState();
	const pageState = getPageState();
</script>

<svelte:head>
	<title>{pageState.actualTitle}</title>
</svelte:head>
<ModeWatcher />
<Toaster richColors={true} position={'top-right'} />
<div class="relative flex min-h-screen flex-col bg-background items-center" data-vaul-drawer-wrapper>
	{@render children()}
</div>
