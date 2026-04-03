ALTER TABLE `accessCodes` ADD `planTier` varchar(32);--> statement-breakpoint
ALTER TABLE `purchases` ADD `stripeSubscriptionId` varchar(128);--> statement-breakpoint
ALTER TABLE `purchases` ADD `planTier` varchar(32);--> statement-breakpoint
ALTER TABLE `purchases` ADD `billingInterval` varchar(16);--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionTier` varchar(32);--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionStatus` varchar(32);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeSubscriptionId` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionCurrentPeriodEnd` timestamp;