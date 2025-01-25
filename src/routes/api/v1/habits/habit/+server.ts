import { db } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import * as tables from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

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
		.returning()
		.execute();

	return json({ resp });
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
    await db
        .delete(tables.habitInstance)
        .where(eq(tables.habitInstance.id, body.data.id))
        .execute();

    return json({ success: true });
};