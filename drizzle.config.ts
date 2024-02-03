import 'dotenv/config';
import type { Config } from 'drizzle-kit';
export default {
	schema: './src/lib/models/DatabaseModels.ts',
	out: './drizzle',
	driver: 'mysql2', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
	dbCredentials: {
		host: process.env.DATABASE_HOST,
		user: process.env.DATABASE_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DATABASE_NAME
	}
} satisfies Config;
