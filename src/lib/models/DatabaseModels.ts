import { mysqlTable, uniqueIndex, varchar, serial, text, datetime } from 'drizzle-orm/mysql-core';

export const users = mysqlTable(
	'users',
	{
		emailAddress: varchar('emailAddress', {
			length: 256
		}).primaryKey(),
		firstName: varchar('firstName', {
			length: 256
		}),
		lastName: text('lastName'),
		password: text('password').notNull(),
		latestLogin: datetime('latestLogin', { mode: 'date' }).notNull(),
		latestChange: datetime('latestChanged', { mode: 'date' }).notNull(),
		created: datetime('created', { mode: 'date' }).notNull()
	},
	(users) => ({
		email: uniqueIndex('name_idx').on(users.emailAddress)
	})
);

export const loginSessions = mysqlTable('loginSessions', {
	id: serial('id').primaryKey(),
	emailAddress: varchar('emailAddress', {
		length: 256
	}).notNull(),
	correlationId: varchar('correlationId', {
		length: 128
	}).notNull(),
	created: datetime('created', { mode: 'date' }).notNull()
});
