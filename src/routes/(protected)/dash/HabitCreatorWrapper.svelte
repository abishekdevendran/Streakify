<script>
	import HabitCreator from './HabitCreator.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import { CalendarPlus2, SparklesIcon } from 'lucide-svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { Button } from '$lib/components/ui/button';

	const isDesktop = new MediaQuery('(min-width: 768px)');
	let open = $state(false);
</script>

{#if isDesktop.current}
	<Dialog.Root bind:open>
		<Dialog.Trigger>
			{#snippet child({ props: triggerProps })}
				<Button {...triggerProps} variant="outline">
					<CalendarPlus2 />
				</Button>
			{/snippet}
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title class="flex items-center gap-2">
					<SparklesIcon class="size-5 text-primary" />
					Create New Habit</Dialog.Title
				>
				<Dialog.Description>Start your journey to better habits today!</Dialog.Description>
			</Dialog.Header>
			<HabitCreator />
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open shouldScaleBackground={true} autoFocus={true}>
		<Drawer.Trigger>
			{#snippet child({ props: triggerProps })}
				<Button {...triggerProps} variant="outline">
					<CalendarPlus2 />
				</Button>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content>
			<div class="mx-auto w-full max-w-sm">
				<Drawer.Header>
					<!-- <div class="bg-muted mx-auto mt-4 h-2 w-[100px] rounded-full"></div> -->
					<Drawer.Title class="flex items-center gap-2">
						<SparklesIcon class="size-5 text-primary" />
						Create New Habit</Drawer.Title
					>
					<Drawer.Description>Start your journey to better habits today!</Drawer.Description>
				</Drawer.Header>
				<div class="p-4">
					<HabitCreator />
				</div>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}
