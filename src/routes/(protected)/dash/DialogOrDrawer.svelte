<script lang="ts">
	import type { Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
		DialogFooter
	} from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Button } from '$lib/components/ui/button';
	interface DialogOrDrawerProps {
		open: boolean;
		onOpenChange?: (open: boolean) => void;
		trigger: Snippet<[Record<string, unknown>]>;
		children?: Snippet;
		title: string;
		description: string;
		footer?: Snippet;
	}

	let {
		open = $bindable(),
		onOpenChange,
		trigger,
		children,
		title,
		description,
		footer
	}: DialogOrDrawerProps = $props();

	const isDesktop = new MediaQuery('(min-width: 768px)');
</script>

{#if isDesktop.current}
	<Dialog bind:open {onOpenChange}>
		<DialogTrigger>
			{#snippet child({ props: triggerProps })}
				{@render trigger(triggerProps)}
			{/snippet}
		</DialogTrigger>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>
			{#if children}
				{@render children()}
			{/if}
			<DialogFooter class="flex gap-2 pt-4">
				{#if footer}
					{@render footer()}
				{/if}
			</DialogFooter>
		</DialogContent>
	</Dialog>
{:else}
	<Drawer.Root bind:open shouldScaleBackground={true} autoFocus={true} {onOpenChange}>
		<Drawer.Trigger>
			{#snippet child({ props: triggerProps })}
				{@render trigger(triggerProps)}
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content>
			<div class="mx-auto w-full max-w-lg">
				<Drawer.Header>
					<Drawer.Title>{title}</Drawer.Title>
					<Drawer.Description>{description}</Drawer.Description>
				</Drawer.Header>
				{#if children}
					{@render children()}
				{/if}
				<Drawer.Footer class="flex gap-2 pt-4">
					{#if footer}
						{@render footer()}
					{/if}
				</Drawer.Footer>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}
