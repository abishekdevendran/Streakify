<script>
	import HabitCreator from './HabitCreator.svelte';
	import { CalendarPlus2, SparklesIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import DialogOrDrawer from './DialogOrDrawer.svelte';
	let open = $state(false);
</script>

<DialogOrDrawer bind:open title="Create New Habit" description="Start your journey to better habits today!">
	{#snippet trigger(triggerProps)}
		<Button {...triggerProps} variant="outline" class="fixed aspect-square right-2 bottom-2 p-3 h-12 w-12">
			<CalendarPlus2 size={64} class="!h-full !w-full" />
		</Button>
	{/snippet}
	{#snippet children()}
		<HabitCreator />
	{/snippet}
</DialogOrDrawer>
