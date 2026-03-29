CREATE TABLE `accessCodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(32) NOT NULL,
	`createdByUserId` int NOT NULL,
	`usedByUserId` int,
	`isUsed` boolean NOT NULL DEFAULT false,
	`companyName` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`usedAt` timestamp,
	CONSTRAINT `accessCodes_id` PRIMARY KEY(`id`),
	CONSTRAINT `accessCodes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripePaymentIntentId` varchar(128) NOT NULL,
	`stripeSessionId` varchar(128),
	`amountPence` int NOT NULL,
	`currency` varchar(8) NOT NULL DEFAULT 'gbp',
	`status` varchar(32) NOT NULL DEFAULT 'completed',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `purchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `hasPurchased` boolean DEFAULT false NOT NULL;