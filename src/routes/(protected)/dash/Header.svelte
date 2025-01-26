<script lang="ts">
	import { getPageState } from '$lib/stores/index.svelte';
	import { CalendarCheck, CircleCheck } from 'lucide-svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import ThemeDropDown from './ThemeDropDown.svelte';
	import Avatar from './Logout.svelte';
	import { scale } from 'svelte/transition';
	const pageState = getPageState();
	let wasRecentlyUpdated = $state(false);
	let timeoutId = -1;
	$effect(() => {
		if (pageState.isAnythingBackgroundUpdating == false) {
			wasRecentlyUpdated = true;
			if (timeoutId != -1) {
				clearTimeout(timeoutId);
			}
			timeoutId = +setTimeout(() => {
				wasRecentlyUpdated = false;
				timeoutId = -1;
			}, 5000);
		}
	});
	let {
		imgSrc,
		alt
	}: {
		imgSrc?: string;
		alt?: string;
	} = $props();
</script>

<header
	class="container sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="flex w-full items-center justify-between">
		<h2 class="text-3xl font-extrabold">Streakify</h2>
		<div class="flex items-center justify-center gap-2 py-2">
			<div class="grid">

				{#if pageState.isAnythingBackgroundUpdating}
				<div in:scale out:scale class="col-span-full row-span-full">
					<LoadingSpinner />
				</div>
				{:else if wasRecentlyUpdated}
				<div in:scale out:scale class="col-span-full row-span-full">
					<CircleCheck />
				</div>
			{/if}
		</div>
			<ThemeDropDown />
			<Avatar {imgSrc} {alt} />
		</div>
	</div>
</header>
