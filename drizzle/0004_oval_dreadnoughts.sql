CREATE TABLE `onlineSession` (
	`sessionId` varchar(128) NOT NULL,
	`initiator` varchar(256) NOT NULL,
	`players` text NOT NULL,
	`cards` int NOT NULL,
	`multiplier` int NOT NULL,
	`created` datetime NOT NULL,
	CONSTRAINT `onlineSession_sessionId` PRIMARY KEY(`sessionId`)
);
--> statement-breakpoint
ALTER TABLE `offlineSessionOutcome` RENAME COLUMN `game` TO `round`;