CREATE TABLE `designs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`certificateRef` varchar(64) NOT NULL,
	`stripePaymentIntentId` varchar(128),
	`stripeSessionId` varchar(128),
	`amountPence` int NOT NULL,
	`currency` varchar(8) NOT NULL DEFAULT 'gbp',
	`paymentStatus` varchar(32) NOT NULL DEFAULT 'pending',
	`projectName` varchar(256),
	`siteLocation` varchar(256),
	`clientName` varchar(256),
	`calculationInputs` json,
	`calculationResult` json,
	`certificateIssued` boolean NOT NULL DEFAULT false,
	`certificateIssuedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `designs_id` PRIMARY KEY(`id`),
	CONSTRAINT `designs_certificateRef_unique` UNIQUE(`certificateRef`)
);
--> statement-breakpoint
DROP TABLE `accessCodes`;--> statement-breakpoint
DROP TABLE `purchases`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `subscriptionTier`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `subscriptionStatus`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `stripeSubscriptionId`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `subscriptionCurrentPeriodEnd`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `hasPurchased`;