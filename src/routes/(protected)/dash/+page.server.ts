import type { Habit } from '$lib/server/db/schema';

export const load = async ({ fetch }) => {
	return {
		habits: (async () => {
			const res = await fetch('/api/v1/habits');
			const json = await res.json();
			return json as Habit[];
		})()
	};
};
