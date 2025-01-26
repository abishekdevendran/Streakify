<script lang="ts">
	import { TrashIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { getPageState } from '$lib/stores/index.svelte';
	import deleteHabit from '$lib/fetchers/habits/delete';
	import { invalidate } from '$app/navigation';
	import DialogOrDrawer from './DialogOrDrawer.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	// Props
	let {
		habitId
	}: {
		habitId: number;
	} = $props();

	let pageState = getPageState();

	// Handle delete action
	const handleDelete = async () => {
		toast.loading('Deleting habit...', { id: 'delete-habit' });
		pageState.isAnythingBackgroundUpdating = true;
		try {
			const resp = await deleteHabit(habitId);
			await invalidate('/api/v1/habits');
			toast.success('Habit deleted successfully!', { id: 'delete-habit' });
		} catch (e) {
			console.error(e);
			toast.error('Failed to delete habit', { id: 'delete-habit' });
		} finally {
			pageState.isAnythingBackgroundUpdating = false;
		}
	};
	let open = $state(false);
</script>

<!-- {#if isDesktop.current}
	<Dialog bind:open>
		<DialogTrigger>
			{#snippet child({ props: triggerProps })}
				<Button
					variant="ghost"
					size="icon"
					class="text-destructive hover:bg-destructive/10"
					{...triggerProps}
				>
					<TrashIcon class="size-4" />
					<span class="sr-only">Delete habit</span>
				</Button>
			{/snippet}
		</DialogTrigger>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Delete Habit</DialogTitle>
				<DialogDescription>
					Are you sure you want to delete this habit? This action cannot be reverted.
				</DialogDescription>
			</DialogHeader>
			<DialogFooter class="flex gap-2 pt-4">
				<Button variant="ghost">Cancel</Button>
				<Button variant="destructive" onclick={handleDelete}>Delete</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
{:else}
	<Drawer.Root bind:open shouldScaleBackground={true} autoFocus={true}>
		<Drawer.Trigger>
			{#snippet child({ props: triggerProps })}
				<Button
					variant="ghost"
					size="icon"
					class="text-destructive hover:bg-destructive/10"
					{...triggerProps}
				>
					<TrashIcon class="size-4" />
					<span class="sr-only">Delete habit</span>
				</Button>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content>
			<div class="mx-auto w-full max-w-sm">
				<Drawer.Header>
					<Drawer.Title class="flex items-center gap-2">
						<TrashIcon class="size-5 text-primary" />
						Delete Habit
					</Drawer.Title>
					<Drawer.Description
						>Are you sure you want to delete this habit? This action cannot be reverted.</Drawer.Description
					>
				</Drawer.Header>
				<Drawer.Footer class="flex gap-2 pt-4">
					<Button variant="ghost" onclick={() => (open = false)}>Cancel</Button>
					<Button variant="destructive" onclick={handleDelete}>Delete</Button>
				</Drawer.Footer>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if} -->

<DialogOrDrawer
	bind:open
	title="Delete Habit"
	description="Are you sure you want to delete this habit? This action cannot be reverted."
>
	{#snippet trigger(triggerProps)}
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props: tooltipProps })}
						<div {...tooltipProps}>
							<Button
								variant="ghost"
								size="icon"
								class="text-destructive hover:bg-destructive/10"
								{...triggerProps}
							>
								<TrashIcon class="size-4" />
								<span class="sr-only">Delete habit</span>
							</Button>
						</div>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>Delete Habit</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	{/snippet}
	{#snippet footer()}
		<Button variant="ghost" onclick={() => (open = false)}>Cancel</Button>
		<Button variant="destructive" onclick={handleDelete}>Delete</Button>
	{/snippet}
</DialogOrDrawer>
