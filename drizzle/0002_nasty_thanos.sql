ALTER TABLE `offlineSession` MODIFY COLUMN `players` text NOT NULL;--> statement-breakpoint
ALTER TABLE `offlineSession` MODIFY COLUMN `cards` int NOT NULL;--> statement-breakpoint
ALTER TABLE `offlineSession` MODIFY COLUMN `multiplier` int NOT NULL;--> statement-breakpoint
ALTER TABLE `offlineSessionOutcome` MODIFY COLUMN `playerCards` text NOT NULL;--> statement-breakpoint
ALTER TABLE `offlineSessionOutcome` ADD `game` int NOT NULL;