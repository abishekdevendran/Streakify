import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './db/schema';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_APP_NAME, PUBLIC_BETTER_AUTH_URL } from '$env/static/public';
import client from './db/redis';

export const auth = betterAuth({
	appName: PUBLIC_APP_NAME,
	baseURL: PUBLIC_BETTER_AUTH_URL,
	database: drizzleAdapter(db, {
		provider: 'pg', // or "mysql", "sqlite",
		schema
	}),
	emailAndPassword: {
		enabled: true
	},
	socialProviders: {
		github: {
			clientId: GITHUB_CLIENT_ID as string,
			clientSecret: GITHUB_CLIENT_SECRET as string
		}
	},
	account: {
		accountLinking: {
			enabled: true
		}
	},
	secondaryStorage: {
		get: async (key) => {
			const value = await client.get(key);
			return value ? value : null;
		},
		set: async (key, value, ttl) => {
			if (ttl) await client.set(key, value, { EX: ttl });
			else await client.set(key, value);
		},
		delete: async (key) => {
			await client.del(key);
		}
	}
	//...
});
