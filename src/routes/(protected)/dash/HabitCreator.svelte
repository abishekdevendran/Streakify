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
	import type { HabitsPostSchema } from '../../api/v1/habits/+server';
	import { invalidate, invalidateAll } from '$app/navigation';
	import createHabit from '$lib/fetchers/habits/create';

	// Form state
	let name: string = $state('');
	let description: string = $state('');
	let frequency: 'daily' | 'weekly' | 'monthly' = $state('daily');
	let count: number = $state(1);
	let isSubmitted: boolean = $state(false);
	let isSubmitting: boolean = $state(false);

	const frequencies = [
		{ value: 'daily', label: 'Daily' },
		{ value: 'weekly', label: 'Weekly' },
		{ value: 'monthly', label: 'Monthly' }
	];

	// Form submission
	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		// Here you would typically save to your database
		console.log({ name, description, frequency, count });
		isSubmitting = true;
		toast.loading('Creating habit...', { id: 'create-habit' });
		try {
			const body: HabitsPostSchema = {
				name: name,
				description: description,
				frequency: frequency,
				count: count
			}
			const resp = await createHabit(body);
			isSubmitted = true;
			await invalidate('/api/v1/habits');
			toast.success('Habit created successfully!', { id: 'create-habit' });
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.message, { id: 'create-habit' });
			}
			toast.error('Failed to create habit', { id: 'create-habit' });
		} finally {
			isSubmitting = false;
		}
	};
</script>

{#if isSubmitted}
	<div class="flex gap-2 flex-col">
		<div class="rounded-lg bg-primary/10 p-4 text-primary" transition:slide>
			<p class="text-center font-medium">🎉 Habit created successfully!</p>
		</div>
		<!-- Another Button -->
		<Button type="submit" class="w-full" onclick={() => (isSubmitted = false)}>
			<SparklesIcon class="mr-2 size-4" />
			Create Another
		</Button>
	</div>
{:else}
	<form onsubmit={handleSubmit} class="space-y-6" transition:slide>
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
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<span class="text-sm text-muted-foreground">times {frequency}</span>
						</TooltipTrigger>
						<TooltipContent>
							<p>How many times you want to do this {frequency}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>

		<!-- Submit Button -->
		<Button type="submit" class="w-full" disabled={isSubmitting}>
			<SparklesIcon class="mr-2 size-4" />
			Create Habit
		</Button>
	</form>
{/if}
