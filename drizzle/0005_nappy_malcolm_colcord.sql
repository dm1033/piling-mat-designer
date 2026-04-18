ALTER TABLE `cpd_requests` ADD `amountPence` int DEFAULT 1999 NOT NULL;--> statement-breakpoint
ALTER TABLE `cpd_requests` ADD `currency` varchar(8) DEFAULT 'gbp' NOT NULL;--> statement-breakpoint
ALTER TABLE `cpd_requests` ADD `paymentStatus` varchar(32) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `cpd_requests` ADD `stripeSessionId` varchar(128);--> statement-breakpoint
ALTER TABLE `cpd_requests` ADD `stripePaymentIntentId` varchar(128);