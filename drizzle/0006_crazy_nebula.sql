ALTER TABLE `designs` ADD `customerEmail` varchar(320);--> statement-breakpoint
ALTER TABLE `designs` ADD `packEmailStatus` enum('pending','sent','failed','manual') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `designs` ADD `packEmailedAt` timestamp;--> statement-breakpoint
ALTER TABLE `designs` ADD `packEmailError` text;