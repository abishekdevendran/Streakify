import { db } from '$lib/server/db/index.js';
import { error, json } from '@sveltejs/kit';
import * as tables from '$lib/server/db/schema.js';
import { habit, habitInstance, user } from '$lib/server/db/schema.js';
import { z } from 'zod';
import { and, eq, gte, or, sql } from 'drizzle-orm';

// Create a new Habit
const habitsPostSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	count: z.number(),
	metric: z.string().nullable().optional(),
	frequency: z.enum(['daily', 'weekly', 'monthly'])
});
export type HabitsPostSchema = z.infer<typeof habitsPostSchema>;

export const POST = async ({ locals, request }) => {
	if (!locals.session || !locals.user) {
		return error(401, 'Unauthorized');
	}
	const body = habitsPostSchema.safeParse(await request.json());
	if (!body.success) {
		return error(400, body.error);
	}
	if(body.data.metric ===''){
		body.data.metric = null
	}
	const resp = await db
		.insert(tables.habit)
		.values({
			userId: locals.user.id,
			...body.data
		})
		.returning()
		.execute();

	return json({ resp });
};

// Update a Habit's details
const habitsPatchSchema = z.object({
	id: z.number(),
	name: z.string().optional(),
	description: z.string().optional(),
	count: z.number().optional(),
	metric: z.string().nullable().optional(),
	frequency: z.enum(['daily', 'weekly', 'monthly']).optional()
});
export type HabitsPatchSchema = z.infer<typeof habitsPatchSchema>;

export const PATCH = async ({ locals, request }) => {
	if (!locals.session || !locals.user) {
		return error(401, 'Unauthorized');
	}
	const body = habitsPatchSchema.safeParse(await request.json());
	if (!body.success) {
		return error(400, body.error);
	}
	if (body.data.metric === '') {
		body.data.metric = null;
	}
	const resp = await db
		.update(tables.habit)
		.set(body.data)
		.where(and(eq(tables.habit.id, body.data.id), eq(tables.habit.userId, locals.user!.id)))
		.returning()
		.execute();

	return json({ resp });
};

// Delete a Habit
const habitsDeleteSchema = z.object({
	id: z.number()
});
export type HabitsDeleteSchema = z.infer<typeof habitsDeleteSchema>;

export const DELETE = async ({ locals, request }) => {
	if (!locals.session || !locals.user) {
		return error(401, 'Unauthorized');
	}
	const body = habitsDeleteSchema.safeParse(await request.json());
	if (!body.success) {
		return error(400, body.error);
	}
	await db.delete(tables.habit).where(and(eq(tables.habit.id, body.data.id),
		eq(tables.habit.userId, locals.user!.id)
	)).execute();

	// Delete all HabitInstances for the Habit
	await db
		.delete(tables.habitInstance)
		.where(eq(tables.habitInstance.habitId, body.data.id))
		.execute();

	return json({ success: true });
};


export type HabitWithInstances = {
	habitId: number;
	habitName: string;
	habitDescription: string | null;
	habitFrequency: 'daily' | 'weekly' | 'monthly';
	habitCount: number;
	habitMetric: string | null;
	instanceCount: number;
	instances: Array<{
		id: number;
		habitId: number;
		date: Date;
	}>;
};

// Get all Habits and their HabitInstances
export const GET = async ({ locals }) => {
	if (!locals.session || !locals.user) {
		return error(401, 'Unauthorized');
	}
	// const habits = await db.query.tables.habit.findMany({
	// 	where: (tables.habit, { eq }) => eq(tables.habit.userId, locals.user!.id),
	// 	with: {
	// 		habitInstances: true
	// 	}
	// });

	// Precalculate the day, week, and month dates
	const now = new Date();
	// Create separate Date objects for each start point
	const startOfDay = new Date(now);
	startOfDay.setHours(0, 0, 0, 0);

	// Calculate the start of the week (Monday)
	const startOfWeek = new Date(now);
	startOfWeek.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1)); // Adjust for Monday as the first day
	startOfWeek.setHours(0, 0, 0, 0);

	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	startOfMonth.setHours(0, 0, 0, 0);
	// Define the query
	const query = db
		.select({
			habitId: habit.id,
			habitName: habit.name,
			habitDescription: habit.description,
			habitFrequency: habit.frequency,
			habitCount: habit.count,
			habitMetric: habit.metric,
			instanceCount: sql<number>`COUNT(${habitInstance.id})`.as('instance_count'),
			instances: sql`JSON_AGG(${habitInstance})`.as('instances')
		})
		.from(habit)
		.leftJoin(
			habitInstance,
			and(
				eq(habitInstance.habitId, habit.id),
				// Filter instances based on frequency
				sql`CASE 
			  WHEN ${habit.frequency} = 'daily' THEN DATE(${habitInstance.date}) >= DATE(${startOfDay})
			  WHEN ${habit.frequency} = 'weekly' THEN DATE(${habitInstance.date}) >= DATE(${startOfWeek})
			  WHEN ${habit.frequency} = 'monthly' THEN DATE(${habitInstance.date}) >= DATE(${startOfMonth})
			END`
			)
		)
		.where(eq(habit.userId, locals.user!.id))
		.groupBy(habit.id, habit.name, habit.description, habit.frequency, habit.count)
		.orderBy(habit.id);

	// Execute the query
	const result = await query.execute() as HabitWithInstances[];
	// Filter out null values from the `instances` arrays
	const filteredResult = result.map((row) => ({
		...row,
		instances: row.instances.filter((instance) => instance !== null),
	})) as HabitWithInstances[];
	return json({ result: filteredResult });
};
