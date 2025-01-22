<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	let isLoading = $state(false);
</script>

<Button
	onclick={() =>
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
		)}
>
	Log out
</Button>
