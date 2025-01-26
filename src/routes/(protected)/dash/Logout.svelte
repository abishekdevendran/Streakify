<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { toast } from 'svelte-sonner';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Button } from '$lib/components/ui/button';
	import DialogOrDrawer from './DialogOrDrawer.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
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

	let open = $state(false);
</script>

{#snippet UserAvatar(triggerProps: Record<string, unknown>, imgSrc?: string, alt?: string)}
	<Avatar.Root class="cursor-pointer rounded-full" {...triggerProps}>
		<Avatar.Image src={imgSrc ?? ''} alt={alt ? `${alt}'s' avatar` : 'user avatar'} />
		<Avatar.Fallback>
			{alt ? alt.slice(0, 1).toUpperCase() : 'U'}
		</Avatar.Fallback>
	</Avatar.Root>
{/snippet}

<DialogOrDrawer bind:open title="Logout" description="Are you sure you want to log out?">
	{#snippet footer()}
		<Button disabled={isLoading} variant="ghost" onclick={() => (open = false)}>Cancel</Button>
		<Button disabled={isLoading} variant="destructive" onclick={handleLogout}>Logout</Button>
	{/snippet}
	{#snippet trigger(triggerProps)}
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props: tooltipProps })}
						<div {...tooltipProps}>
							{@render UserAvatar(triggerProps, imgSrc, alt)}
						</div>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>Logout</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	{/snippet}
</DialogOrDrawer>
