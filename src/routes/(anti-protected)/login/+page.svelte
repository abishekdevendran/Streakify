<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { getPageState } from '$lib/stores/index.svelte';

	const pageState = getPageState();
	pageState.title = 'Login';
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Login</Card.Title>
			<Card.Description>Enter your email below to login to your account</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" placeholder="m@example.com" required />
				</div>
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password">Password</Label>
					</div>
					<Input id="password" type="password" required />
				</div>
				<Button type="submit" class="w-full">Login</Button>
				<Button
					type="button"
					variant="outline"
					class="w-full"
					onclick={async (e) => {
						e.preventDefault();
						await authClient.signIn.social({
							provider: 'github',
							callbackURL: '/dash' //redirect to dashboard after sign in
						});
					}}>Login with Github</Button
				>
			</div>
			<div class="mt-4 text-center text-sm">
				Don't have an account?
				<a href="/signup" class="underline"> Sign up </a>
			</div>
		</Card.Content>
	</Card.Root>
</div>
