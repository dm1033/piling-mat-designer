CREATE TABLE `cpd_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactName` varchar(256) NOT NULL,
	`companyName` varchar(256) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64),
	`jobTitle` varchar(256),
	`preferredDate` varchar(128),
	`attendees` varchar(64),
	`format` enum('online','in-person','either') NOT NULL DEFAULT 'either',
	`additionalNotes` text,
	`status` enum('new','contacted','confirmed','completed','cancelled') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cpd_requests_id` PRIMARY KEY(`id`)
);
