<script lang="ts">
	import { getPageState } from '$lib/stores/index.svelte';
	import HabitCreatorWrapper from './HabitCreatorWrapper.svelte';
	import ThemeDropDown from './ThemeDropDown.svelte';

	let { data } = $props();
	const pageState = getPageState();
	pageState.title = 'Dashboard';
</script>

<ThemeDropDown />

{#await data.habits}
	Loading...
{:then habits}
	{#each habits as habit}
		<div>{habit.name}</div>
	{/each}
{/await}

<HabitCreatorWrapper />
