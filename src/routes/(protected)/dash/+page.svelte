<script lang="ts">
	import { getPageState } from '$lib/stores/index.svelte';
	import HabitCard from './HabitCard.svelte';
	import HabitCreatorWrapper from './HabitCreatorWrapper.svelte';
	import { flip } from 'svelte/animate';
	import { receive, send } from './transition';
	import Header from './Header.svelte';

	let { data } = $props();
	$inspect("user", data.user);
	let habits = $state(data.habits);
	$effect(() => {
		habits = data.habits;
	});
	let dailyHabits = $derived(
		habits.filter((h) => h.habitFrequency === 'daily' && h.instances.length < h.habitCount)
	);
	let weeklyHabits = $derived(
		habits.filter((h) => h.habitFrequency === 'weekly' && h.instances.length < h.habitCount)
	);
	let monthlyHabits = $derived(
		habits.filter((h) => h.habitFrequency === 'monthly' && h.instances.length < h.habitCount)
	);
	let upcomingHabits = $derived(habits.filter((h) => h.instances.length >= h.habitCount));
	const pageState = getPageState();
	pageState.title = 'Dashboard';
</script>

<Header imgSrc={data.user.image ?? undefined} alt={data.user.name} />
<div class="container">
	{#if dailyHabits.length > 0}
		<div class="flex w-full flex-col gap-2 pt-2">
			<div class="text-2xl font-semibold transition-all duration-300">Daily Habits</div>
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
				{#each dailyHabits as habit (habit.habitId)}
					<div
						class="flex w-full items-center justify-between gap-2 rounded-xl border-2 p-2 max-md:flex-col md:pl-4"
						in:receive={{ key: habit.habitId }}
						out:send={{ key: habit.habitId }}
						animate:flip={{ duration: 200 }}
					>
						<HabitCard bind:habit={habits[habits.indexOf(habit)]} />
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if weeklyHabits.length > 0}
		<div class="flex w-full flex-col gap-2 pt-2">
			<div class="text-2xl font-semibold transition-all duration-300">Weekly Habits</div>
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
				{#each weeklyHabits as habit (habit.habitId)}
					<div
						class="flex w-full items-center justify-between gap-2 rounded-xl border-2 p-2 max-md:flex-col md:pl-4"
						in:receive={{ key: habit.habitId }}
						out:send={{ key: habit.habitId }}
						animate:flip={{ duration: 200 }}
					>
						<HabitCard bind:habit={habits[habits.indexOf(habit)]} />
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if monthlyHabits.length > 0}
		<div class="flex w-full flex-col gap-2 pt-2">
			<div class="text-2xl font-semibold transition-all duration-300">Monthly Habits</div>
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
				{#each monthlyHabits as habit (habit.habitId)}
					<div
						class="flex w-full items-center justify-between gap-2 rounded-xl border-2 p-2 max-md:flex-col md:pl-4"
						in:receive={{ key: habit.habitId }}
						out:send={{ key: habit.habitId }}
						animate:flip={{ duration: 200 }}
					>
						<HabitCard bind:habit={habits[habits.indexOf(habit)]} />
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if upcomingHabits.length > 0}
		<div class="flex w-full flex-col gap-2 pt-2">
			<div class="text-2xl font-semibold transition-all duration-300">Upcoming Habits</div>
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
				{#each upcomingHabits as habit (habit.habitId)}
					<div
						class="flex w-full items-center justify-between gap-2 rounded-xl border-2 p-2 max-md:flex-col md:pl-4"
						in:receive={{ key: habit.habitId }}
						out:send={{ key: habit.habitId }}
						animate:flip={{ duration: 200 }}
					>
						<HabitCard bind:habit={habits[habits.indexOf(habit)]} />
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<HabitCreatorWrapper />
{#if !habits?.length}
<div class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 opacity-45 pointer-events-none">
	<div class="text-2xl font-semibold">No habits found</div>
	<div class="flex gap-2 whitespace-pre-line text-center">
		Let's create one!
		Start by clicking the button at the bottom right of the page!
	</div>
</div>
{/if}
