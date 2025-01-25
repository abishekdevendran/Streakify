<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { toast } from 'svelte-sonner';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
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
	let {
		imgSrc,
		alt
	}: {
		imgSrc?: string;
		alt?: string;
	} = $props();
	let isLoading = $state(false);

	const handleLogout = async () => {
		toast.promise(
			async () => {
				isLoading = true;
				try {
					await authClient.signOut({
						fetchOptions: {
							onSuccess: () => {
								// Redirect to the login page
								invalidateAll();
							}
						}
					});
				} catch (error) {
					// Handle the error here
					console.error('Error during sign out:', error);
					throw error; // Re-throw the error to ensure the promise is rejected
				} finally {
					isLoading = false;
				}
			},
			{
				loading: 'Logging out...',
				success: 'Logged out successfully',
				error: 'Failed to log out'
			}
		);
	};
	const isDesktop = new MediaQuery('(min-width: 768px)');
	let open = $state(false);
</script>

{#if isDesktop.current}
	<Dialog bind:open>
		<DialogTrigger>
			{#snippet child({ props: triggerProps })}
				<Avatar.Root class="cursor-pointer rounded-full" {...triggerProps}>
					<Avatar.Image src={imgSrc ?? ''} alt={alt ? `${alt}'s' avatar` : 'user avatar'} />
					<Avatar.Fallback>
						{alt ? alt.slice(0, 1).toUpperCase() : 'U'}
					</Avatar.Fallback>
				</Avatar.Root>
			{/snippet}
		</DialogTrigger>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Logout</DialogTitle>
				<DialogDescription>Are you sure you want to log out?</DialogDescription>
			</DialogHeader>
			<DialogFooter class="flex gap-2 pt-4">
				<Button disabled={isLoading} variant="ghost" onclick={() => (open = false)}>Cancel</Button>
				<Button disabled={isLoading} variant="destructive" onclick={handleLogout}>Logout</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
{:else}
	<Drawer.Root bind:open shouldScaleBackground={true} autoFocus={true}>
		<Drawer.Trigger>
			{#snippet child({ props: triggerProps })}
				<Avatar.Root class="cursor-pointer rounded-full" {...triggerProps}>
					<Avatar.Image src={imgSrc ?? ''} alt={alt ? `${alt}'s' avatar` : 'user avatar'} />
					<Avatar.Fallback>
						{alt ? alt.slice(0, 1).toUpperCase() : 'U'}
					</Avatar.Fallback>
				</Avatar.Root>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content>
			<div class="mx-auto w-full max-w-sm">
				<Drawer.Header>
					<Drawer.Title class="flex items-center gap-2">
						<Avatar.Root>
							<Avatar.Image src={imgSrc ?? ''} alt={alt ? `${alt}'s' avatar` : 'user avatar'} />
							<Avatar.Fallback>
								{alt ? alt.slice(0, 1).toUpperCase() : 'U'}
							</Avatar.Fallback>
						</Avatar.Root>
						Logout
					</Drawer.Title>
					<Drawer.Description>Are you sure you want to log out?</Drawer.Description>
				</Drawer.Header>
				<Drawer.Footer class="flex gap-2 pt-4">
					<Button disabled={isLoading} variant="ghost" onclick={() => (open = false)}>Cancel</Button
					>
					<Button disabled={isLoading} variant="destructive" onclick={handleLogout}>Logout</Button>
				</Drawer.Footer>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}
