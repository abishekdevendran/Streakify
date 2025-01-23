import { db } from '$lib/server/db/index.js';
import { error, json } from '@sveltejs/kit';
import * as tables from '$lib/server/db/schema.js';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

// Create a new Habit
const habitsPostSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	count: z.number(),
	frequency: z.enum(['daily', 'weekly', 'monthly'])
});

export const POST = async ({ locals, request }) => {
	if (!locals.session || !locals.user) {
		return error(401, 'Unauthorized');
	}
	const body = habitsPostSchema.safeParse(await request.json());
	if (!body.success) {
		return error(400, body.error);
	}
	const resp = await db
		.insert(tables.habit)
		.values({
			userId: locals.user.id,
			...body.data
		})
		.execute();

	return json({ resp });
};

// Update a Habit's details
const habitsPatchSchema = z.object({
	id: z.number(),
	name: z.string().optional(),
	description: z.string().optional(),
	count: z.number().optional(),
	frequency: z.enum(['daily', 'weekly', 'monthly']).optional()
});

export const PATCH = async ({ locals, request }) => {
	if (!locals.session || !locals.user) {
		return error(401, 'Unauthorized');
	}
	const body = habitsPatchSchema.safeParse(await request.json());
	if (!body.success) {
		return error(400, body.error);
	}
	const resp = await db
		.update(tables.habit)
		.set(body.data)
		.where(eq(tables.habit.id, body.data.id))
		.execute();

	return json({ resp });
};

// Delete a Habit
const habitsDeleteSchema = z.object({
	id: z.number()
});

export const DELETE = async ({ locals, request }) => {
	if (!locals.session || !locals.user) {
		return error(401, 'Unauthorized');
	}
	const body = habitsDeleteSchema.safeParse(await request.json());
	if (!body.success) {
		return error(400, body.error);
	}
	await db.delete(tables.habit).where(eq(tables.habit.id, body.data.id)).execute();

	// Delete all HabitInstances for the Habit
	await db
		.delete(tables.habitInstance)
		.where(eq(tables.habitInstance.habitId, body.data.id))
		.execute();

	return json({ success: true });
};

// Put new habit instance
const habitInstancePutSchema = z.object({
  habitId: z.number(),
  date: z.string()
});

export const PUT = async ({ locals, request }) => {
  if (!locals.session || !locals.user) {
    return error(401, 'Unauthorized');
  }
  const body = habitInstancePutSchema.safeParse(await request.json());
  if (!body.success) {
    return error(400, body.error);
  }
  const resp = await db
    .insert(tables.habitInstance)
    .values({
      habitId: body.data.habitId,
      date: new Date(body.data.date)
    })
    .execute();

  return json({ resp });
};

// Get all Habits and their HabitInstances
export const GET = async ({ locals }) => {
	if (!locals.session || !locals.user) {
		return error(401, 'Unauthorized');
	}
	const habits = await db.query.habit.findMany({
		where: (habit, { eq }) => eq(habit.userId, locals.user!.id),
		with: {
			habitInstances: true
		}
	});
	return json({ habits });
};
