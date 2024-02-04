import {
	mysqlTable,
	uniqueIndex,
	varchar,
	serial,
	text,
	datetime,
	int,
	boolean,
	decimal
} from 'drizzle-orm/mysql-core';

export const user = mysqlTable(
	'user',
	{
		emailAddress: varchar('emailAddress', {
			length: 256
		}).primaryKey(),
		firstName: varchar('firstName', {
			length: 256
		}),
		lastName: text('lastName'),
		showInLeaderboard: boolean('showInLeaderboard').notNull(),
		password: text('password').notNull(),
		latestLogin: datetime('latestLogin', { mode: 'date' }).notNull(),
		latestChange: datetime('latestChanged', { mode: 'date' }).notNull(),
		created: datetime('created', { mode: 'date' }).notNull()
	},
	(user) => ({
		email: uniqueIndex('email_idx').on(user.emailAddress)
	})
);

export const loginSession = mysqlTable('loginSession', {
	id: serial('id').primaryKey(),
	emailAddress: varchar('emailAddress', {
		length: 256
	}).notNull(),
	correlationId: varchar('correlationId', {
		length: 128
	}).notNull(),
	created: datetime('created', { mode: 'date' }).notNull()
});

export const offlineSession = mysqlTable('offlineSession', {
	sessionId: varchar('sessionId', {
		length: 128
	}).primaryKey(),
	initiator: varchar('initiator', {
		length: 256
	}).notNull(),
	players: text('players').notNull(),
	cards: int('cards').notNull(),
	multiplier: int('multiplier').notNull(),
	created: datetime('created', { mode: 'date' }).notNull()
});

export const offlineSessionOutcome = mysqlTable('offlineSessionOutcome', {
	id: serial('id').primaryKey(),
	sessionId: varchar('sessionId', {
		length: 128
	}).notNull(),
	game: int('game').notNull(),
	playerCards: text('playerCards').notNull(),
	winner: varchar('winner', {
		length: 256
	}).notNull(),
	loser: varchar('loser', {
		length: 256
	}).notNull(),
	amount: decimal('amount').notNull(),
	created: datetime('created', { mode: 'date' }).notNull()
});
