<script lang="ts">
	import { MinusIcon, PlusIcon, Trash2 } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import deleteHabitInstance from '$lib/fetchers/habits/deleteInstance';
	import { getPageState } from '$lib/stores/index.svelte';
	import { invalidate } from '$app/navigation';
	import insertHabitInstance from '$lib/fetchers/habits/insertInstance';
	import type { HabitWithInstances } from '../../api/v1/habits/+server';
	import DeleteHabit from './DeleteHabit.svelte';

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
</script>

<div class="text-xl font-semibold">{habit.habitName}</div>
<div class="flex gap-2 max-md:flex-col md:gap-4">
	<!-- Progress count -->
	<div class="text-center">
		<span class="text-2xl font-bold">{habit.instances.length}</span>
		<span class="text-muted-foreground">/{habit.habitCount}</span>
	</div>

	<!-- Control buttons -->
	<div class="flex items-center justify-center gap-2">
		<Button
			variant="outline"
			size="icon"
			onclick={decrementCount}
			disabled={habit.instances.length === 0 || habit.instances.at(-1)!.id < 0}
		>
			<MinusIcon class="size-4" />
		</Button>
		<Button variant="outline" size="icon" onclick={incrementCount}>
			<PlusIcon class="size-4" />
		</Button>
		<DeleteHabit habitId={habit.habitId} />
	</div>
</div>
