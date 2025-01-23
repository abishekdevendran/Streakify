<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { ModeWatcher } from "mode-watcher";
	import { getPageState, setPageState } from '$lib/stores/index.svelte';

	let { children } = $props();

	setPageState();
	const pageState = getPageState();
</script>

<svelte:head>
	<title>{pageState.actualTitle}</title>
</svelte:head>
<ModeWatcher />
<Toaster richColors />
{@render children()}
