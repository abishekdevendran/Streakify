import { db } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import { and, eq, sql } from 'drizzle-orm';
import { habit, habitInstance } from '$lib/server/db/schema.js';

// Put new habit instance
const habitInstancePutSchema = z.object({
	habitId: z.number(),
	date: z.string()
});
export type HabitInstancePutSchema = z.infer<typeof habitInstancePutSchema>;

export const PUT = async ({ locals, request }) => {
	if (!locals.session || !locals.user) {
		return error(401, 'Unauthorized');
	}

	// Parse and validate the request body
	const body = habitInstancePutSchema.safeParse(await request.json());
	if (!body.success) {
		return error(400, body.error);
	}

	const { habitId, date } = body.data;
	const instanceDate = new Date(date);

	// Precalculate the day, week, and month dates
	const now = new Date();
	// Create separate Date objects for each start point
	const startOfDay = new Date(now);
	startOfDay.setHours(0, 0, 0, 0);

	// Calculate the closest Monday in the past
	const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
	startOfWeek.setHours(0, 0, 0, 0);

	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	startOfMonth.setHours(0, 0, 0, 0);

	// Get count of instances in current frequency window
	const resp = (await db
		.select({
			count: habit.count,
			currentStreak: habit.currentStreak,
			longestStreak: habit.longestStreak,
			isCurrStreak: habit.isCurrStreak,
			completion: sql<number>`COUNT(${habitInstance.id})`.mapWith(Number).as('instance_count'),
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
		.where(and(eq(habit.userId, locals.user!.id), eq(habit.id, habitId)))
		.groupBy(habit.id, habit.name, habit.description, habit.frequency, habit.count)
		.orderBy(habit.id))[0];

	// Create new instance
	const ins = await db
		.insert(habitInstance)
		.values({
			habitId,
			date: instanceDate,
		})
		.returning()
		.execute();

	// If resp.count == 1 + resp.completion, then the user has completed the habit, habit needs updating
	if (resp.count === 1 + resp.completion) {
		await db
			.update(habit)
			.set({
				currentStreak: resp.currentStreak + 1,
				longestStreak: Math.max(resp.longestStreak, resp.currentStreak + 1),
				isCurrStreak: resp.longestStreak === resp.currentStreak ? true : false
			})
			.where(eq(habit.id, habitId))
			.execute();
	}

	return json({ resp: ins });
};

// DELETE a habit instance
const habitInstanceDeleteSchema = z.object({
	id: z.number()
})
export const DELETE = async ({ locals, request }) => {
	if (!locals.session || !locals.user) {
		return error(401, 'Unauthorized');
	}
	const body = habitInstanceDeleteSchema.safeParse(await request.json());
	if (!body.success) {
		return error(400, body.error);
	}
	const { id: habitInstanceId } = body.data;

	// Get current date
	const now = new Date();
	// Create separate Date objects for each start point
	const startOfDay = new Date(now);
	startOfDay.setHours(0, 0, 0, 0);

	// Calculate the closest Monday in the past
	const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
	startOfWeek.setHours(0, 0, 0, 0);

	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	startOfMonth.setHours(0, 0, 0, 0);

	// Get habit id
	const habitId = (await db.query.habitInstance.findFirst({
		where: (habitInstance, { eq }) => eq(habitInstance.id, habitInstanceId),
		columns: { habitId: true },
	}))?.habitId;

	if (!habitId) {
		return error(404, 'Habit instance invalid');
	}

	// Get count of instances in current frequency window
	const resp = (await db
		.select({
			count: habit.count,
			currentStreak: habit.currentStreak,
			longestStreak: habit.longestStreak,
			isCurrStreak: habit.isCurrStreak,
			completion: sql<number>`COUNT(${habitInstance.id})`.mapWith(Number).as('instance_count'),
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
		.where(and(eq(habit.userId, locals.user!.id), eq(habit.id, habitId)))
		.groupBy(habit.id, habit.name, habit.description, habit.frequency, habit.count)
		.orderBy(habit.id))[0];

	// if resp.count == resp.completion, then the streak needs to be recalculated
	if (resp.count === resp.completion) {
		await db
			.update(habit)
			.set({
				currentStreak: Math.max(0, resp.currentStreak - 1),
				longestStreak: resp.isCurrStreak ? Math.max(0, resp.currentStreak - 1) : resp.longestStreak,
				isCurrStreak: false
			})
			.where(eq(habit.id, habitId))
			.execute();
	}

	await db
		.delete(habitInstance)
		.where(eq(habitInstance.id, body.data.id))
		.execute();

	return json({ success: true });
};