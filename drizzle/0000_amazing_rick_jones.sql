CREATE TABLE `loginSession` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`emailAddress` varchar(256) NOT NULL,
	`correlationId` varchar(128) NOT NULL,
	`created` datetime NOT NULL,
	CONSTRAINT `loginSession_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `offlineSession` (
	`sessionId` varchar(128) NOT NULL,
	`initiator` varchar(256) NOT NULL,
	`players` text,
	`cards` int,
	`multiplier` int,
	`created` datetime NOT NULL,
	CONSTRAINT `offlineSession_sessionId` PRIMARY KEY(`sessionId`)
);
--> statement-breakpoint
CREATE TABLE `offlineSessionOutcome` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`playerCards` text,
	`winner` varchar(256) NOT NULL,
	`loser` varchar(256) NOT NULL,
	`amount` datetime NOT NULL,
	`created` datetime NOT NULL,
	CONSTRAINT `offlineSessionOutcome_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`emailAddress` varchar(256) NOT NULL,
	`firstName` varchar(256),
	`lastName` text,
	`showInLeaderboard` boolean NOT NULL,
	`password` text NOT NULL,
	`latestLogin` datetime NOT NULL,
	`latestChanged` datetime NOT NULL,
	`created` datetime NOT NULL,
	CONSTRAINT `user_emailAddress` PRIMARY KEY(`emailAddress`),
	CONSTRAINT `email_idx` UNIQUE(`emailAddress`)
);
