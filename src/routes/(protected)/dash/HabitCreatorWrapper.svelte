<script>
	import HabitCreator from './HabitCreator.svelte';
	import { CalendarPlus2 } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import DialogOrDrawer from './DialogOrDrawer.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	let open = $state(false);
</script>

<DialogOrDrawer
	bind:open
	title="Create New Habit"
	description="Start your journey to better habits today!"
>
	{#snippet trigger(triggerProps)}
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger class="absolute bottom-4 right-4">
					{#snippet child({ props: tooltipProps })}
						<div {...tooltipProps}>
							<Button
								{...triggerProps}
								variant="outline"
								class="aspect-square h-12 w-12 p-3"
							>
								<CalendarPlus2 size={64} class="!h-full !w-full" />
							</Button>
						</div>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>Create Habit</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	{/snippet}
	{#snippet children()}
		<HabitCreator />
	{/snippet}
</DialogOrDrawer>
