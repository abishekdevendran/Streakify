<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		TooltipProvider,
		Tooltip,
		TooltipContent,
		TooltipTrigger
	} from '$lib/components/ui/tooltip';
	import { ActivityIcon, CalendarIcon, HashIcon, SparklesIcon } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { slide } from 'svelte/transition';
	import type { HabitsPatchSchema, HabitWithInstances } from '../../api/v1/habits/+server';
	import { invalidate } from '$app/navigation';
	import updateHabit from '$lib/fetchers/habits/update';

	let {
		habit
	}: {
		habit: HabitWithInstances;
	} = $props();

	// Form state
	let isSubmitting = $state(false);
	let name = $state(habit.habitName);
	let description = $state(habit.habitDescription ?? '');
	let frequency = $state(habit.habitFrequency);
	let count = $state(habit.habitCount);
	let metric = $state(habit.habitMetric ?? '');

	// React to habit changes
	$effect(() => {
		name = habit.habitName;
		description = habit.habitDescription ?? '';
		frequency = habit.habitFrequency;
		count = habit.habitCount;
		metric = habit.habitMetric ?? '';
	});

	let isDiff = $derived(
		name !== habit.habitName ||
			description !== habit.habitDescription ||
			frequency !== habit.habitFrequency ||
			count !== habit.habitCount ||
			metric !== habit.habitMetric
	);

	const frequencies = [
		{ value: 'daily', label: 'Daily', unit: 'day' },
		{ value: 'weekly', label: 'Weekly', unit: 'week' },
		{ value: 'monthly', label: 'Monthly', unit: 'month' }
	];

	const handleUpdate = async (e: Event) => {
		e.preventDefault();
		// Here you would typically save to your database
		console.log({ name, description, frequency, count });
		isSubmitting = true;
		toast.loading('Updating habit...', { id: 'update-habit' });
		try {
			const body: HabitsPatchSchema = {
				id: habit.habitId,
				name: name,
				description: description,
				frequency: frequency,
				count: count,
				metric: metric
			};
			const resp = await updateHabit(body);
			await invalidate('/api/v1/habits');
			toast.success('Habit updated successfully!', { id: 'update-habit' });
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.message, { id: 'update-habit' });
			}
			toast.error('Failed to create habit', { id: 'update-habit' });
		} finally {
			isSubmitting = false;
		}
	};
</script>

<form onsubmit={handleUpdate} class="space-y-6 px-4" transition:slide>
	<!-- Habit Name -->
	<div class="space-y-2">
		<Label class="flex items-center gap-2">
			<ActivityIcon class="size-4" />
			Habit Name
		</Label>
		<Input type="text" placeholder="Enter habit name" bind:value={name} required />
	</div>

	<!-- Description -->
	<div class="space-y-2">
		<Label>Description (Optional)</Label>
		<Textarea
			placeholder="Why do you want to build this habit?"
			bind:value={description}
			class="resize-none"
		/>
	</div>

	<!-- Frequency -->
	<div class="space-y-2">
		<Label class="flex items-center gap-2">
			<CalendarIcon class="size-4" />
			Frequency
		</Label>
		<Select type="single" bind:value={frequency}>
			<SelectTrigger>{frequency}</SelectTrigger>
			<SelectContent>
				{#each frequencies as freq}
					<SelectItem value={freq.value}>{freq.label}</SelectItem>
				{/each}
			</SelectContent>
		</Select>
	</div>

	<!-- Count -->
	<div class="space-y-2">
		<Label class="flex items-center gap-2">
			<HashIcon class="size-4" />
			Count Goal
		</Label>
		<div class="flex items-center gap-4">
			<Input type="number" min="1" bind:value={count} required class="w-32" />
			<Input type="text" bind:value={metric} class="w-32" placeholder="times" />
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<span class="text-sm text-muted-foreground">{frequency}</span>
					</TooltipTrigger>
					<TooltipContent>
						<p>
							{count}
							{metric ?? 'time(s)'} per {frequencies.find((f) => f.value === frequency)?.unit}
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	</div>

	<!-- Submit Button -->
	<Button type="submit" class="w-full" disabled={isSubmitting || !isDiff}>
		<SparklesIcon class="mr-2 size-4" />
		{isDiff ? 'Update Habit' : 'No changes made'}
	</Button>
</form>
