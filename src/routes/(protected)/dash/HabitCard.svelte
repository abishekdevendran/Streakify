<script lang="ts">
	import { Flame, MinusIcon, PlusIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import deleteHabitInstance from '$lib/fetchers/habits/deleteInstance';
	import { getPageState } from '$lib/stores/index.svelte';
	import { invalidate } from '$app/navigation';
	import insertHabitInstance from '$lib/fetchers/habits/insertInstance';
	import type { HabitWithInstances } from '../../api/v1/habits/+server';
	import DeleteHabit from './DeleteHabit.svelte';
	import DialogOrDrawer from './DialogOrDrawer.svelte';
	import HabitUpdater from './HabitUpdater.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Badge } from '$lib/components/ui/badge';

	let {
		habit = $bindable()
	}: {
		habit: HabitWithInstances;
	} = $props();

	const pageState = getPageState();

	const decrementCount = async () => {
		let delElem = habit.instances.pop();
		if (!delElem) return;
		try {
			pageState.isAnythingBackgroundUpdating = true;
			await deleteHabitInstance(delElem.id);
			await invalidate('/api/v1/habits');
		} catch (e) {
			console.error(e);
			if (!habit.instances.includes(delElem)) {
				habit.instances.push(delElem);
			}
		} finally {
			pageState.isAnythingBackgroundUpdating = false;
		}
	};
	const incrementCount = async () => {
		let tempEl = { date: new Date(), id: -1 * Date.now(), habitId: habit.habitId };
		habit.instances.push(tempEl);
		try {
			pageState.isAnythingBackgroundUpdating = true;
			await insertHabitInstance({
				habitId: habit.habitId,
				date: new Date().toDateString()
			});
			console.log('Invalidating: /api/v1/habits');
			await invalidate('/api/v1/habits');
		} catch (e) {
			console.error(e);
			if (habit.instances.includes(tempEl)) {
				habit.instances.splice(habit.instances.indexOf(tempEl), 1);
			}
		} finally {
			pageState.isAnythingBackgroundUpdating = false;
		}
	};

	let open = $state(false);
</script>

{#if habit.habitCurrentStreak > 0}
	<Badge class="rounded-full flex items-center justify-center text-xs p-1 px-2 absolute bottom-0 right-0 translate-y-3/4 w-24 pointer-events-none">
		<Flame size="14" />
		Current: {habit.habitCurrentStreak}
	</Badge>
{/if}

{#if habit.habitLongestStreak > 0}
	<Badge class="rounded-full flex items-center justify-center text-xs p-1 px-2 absolute bottom-0 left-0 translate-y-3/4 w-24 pointer-events-none" variant="secondary">
		<Flame size="14" />
		Longest: {habit.habitLongestStreak}
	</Badge>
{/if}

<DialogOrDrawer
	bind:open
	title={habit.habitName}
	description={habit.habitDescription ?? 'A healthy habit!'}
>
	{#snippet trigger(triggerProps)}
		<Button
			variant="ghost"
			class="grow justify-start overflow-hidden text-ellipsis whitespace-nowrap p-2 text-start text-xl font-semibold"
			{...triggerProps}
		>
			<div class="w-full overflow-hidden text-ellipsis whitespace-nowrap">
				{habit.habitName}
			</div>
		</Button>
	{/snippet}
	{#snippet children()}
		<HabitUpdater {habit} />
	{/snippet}
</DialogOrDrawer>

<div class="flex gap-2 max-md:flex-col md:gap-4">
	<!-- Progress count -->
	<div class="whitespace-nowrap text-center">
		<span class="text-2xl font-bold">{habit.instances.length}</span>
		<span class="text-muted-foreground">/{habit.habitCount}</span>
	</div>

	<!-- Control buttons -->
	<div class="flex items-center justify-center gap-2">
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props: tooltipProps })}
						<div {...tooltipProps}>
							<Button
								variant="outline"
								size="icon"
								onclick={decrementCount}
								disabled={habit.instances.length === 0 || habit.instances.at(-1)!.id < 0}
							>
								<MinusIcon class="size-4" />
							</Button>
						</div>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>Decrease Count</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props: tooltipProps })}
						<div {...tooltipProps}>
							<Button variant="outline" size="icon" onclick={incrementCount}>
								<PlusIcon class="size-4" />
							</Button>
						</div>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>Increase Count</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
		<DeleteHabit habitId={habit.habitId} />
	</div>
</div>
