ALTER TABLE `user` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `user` ADD PRIMARY KEY(`userName`);--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `username_index` UNIQUE(`userName`);--> statement-breakpoint
ALTER TABLE `user` DROP INDEX `email_idx`;--> statement-breakpoint
ALTER TABLE `loginSession` ADD `userName` varchar(126) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `userName` varchar(126) NOT NULL;--> statement-breakpoint
ALTER TABLE `loginSession` DROP COLUMN `emailAddress`;