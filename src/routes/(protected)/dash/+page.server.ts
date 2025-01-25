import type { Habit, HabitInstance } from '$lib/server/db/schema';
import type { HabitWithInstances } from '../../api/v1/habits/+server.js';

export const load = async ({ fetch, depends }) => {
	depends('/api/v1/habits') // Server load functions will never automatically depend on a fetched url to avoid leaking secrets to the client.
	const res = await fetch('/api/v1/habits');
	const json = (await res.json()).result as HabitWithInstances[];
	return {
		habits: json
	}
};
