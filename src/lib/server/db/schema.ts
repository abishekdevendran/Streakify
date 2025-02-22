import { relations } from 'drizzle-orm';
import {
	pgTable,
	text,
	integer,
	timestamp,
	boolean,
	serial,
	pgEnum,
	json,
	uniqueIndex
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

// frequency enum
export const frequency = pgEnum('frequency', ['daily', 'weekly', 'monthly']);

export const habit = pgTable('habit', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.notNull(),
	name: text('name').notNull(),
	description: text('description'),
	frequency: frequency('frequency').notNull(),
	count: integer('count').notNull(),
	metric: text('metric'),
	isCurrStreak: boolean('is_curr_streak').notNull().default(false),
	longestStreak: integer('longest_streak').notNull().default(0),
	currentStreak: integer('current_streak').notNull().default(0),
});

export const habitInstance = pgTable('habit_instance', {
	id: serial('id').primaryKey(),
	habitId: integer('habit_id')
		.references(() => habit.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.notNull(),
	date: timestamp('date').notNull()
}, (t)=>[{
	idx_habit_date: uniqueIndex('idx_habit_date').on(t.habitId, t.date),
	idx_compund_habit_date: uniqueIndex('idx_compund_habit_date').on(t.date, t.habitId),
}]);

// relations
export const userRelations = relations(user, ({ one, many }) => ({
	sessions: many(session),
	account: one(account, {
		fields: [user.id],
		references: [account.userId]
	})
}));

export const sessionRelations = relations(session, ({ one, many }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export const accountRelations = relations(account, ({ one, many }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	})
}));

export const habitRelations = relations(habit, ({ one, many }) => ({
	user: one(user, {
		fields: [habit.userId],
		references: [user.id]
	}),
	habitInstances: many(habitInstance),
	// streaks: many(streak)
}));

export const habitInstanceRelations = relations(habitInstance, ({ one, many }) => ({
	habit: one(habit, {
		fields: [habitInstance.habitId],
		references: [habit.id]
	})
}));

// export const streakRelations = relations(streak, ({ one, many }) => ({
// 	habit: one(habit, {
// 		fields: [streak.habitId],
// 		references: [habit.id]
// 	})
// }));

// types
export type Habit = typeof habit.$inferSelect;
export type HabitInstance = typeof habitInstance.$inferSelect;