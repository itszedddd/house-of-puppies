CREATE TABLE `Role` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Staff` (
  `id` varchar(255) NOT NULL,
  `roleId` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `PetOwner` (
  `id` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `contactNumber` varchar(255) NOT NULL,
  `email` varchar(255),
  `address` varchar(255),
  PRIMARY KEY (`id`)
);

CREATE TABLE `Pet` (
  `id` varchar(255) NOT NULL,
  `ownerId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `species` varchar(255) NOT NULL,
  `breed` varchar(255),
  `dateOfBirth` varchar(255),
  PRIMARY KEY (`id`)
);

CREATE TABLE `PurposeOfVisit` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255),
  PRIMARY KEY (`id`)
);

CREATE TABLE `ClinicalRecord` (
  `id` varchar(255) NOT NULL,
  `petId` varchar(255) NOT NULL,
  `visitDate` datetime NOT NULL,
  `purposeId` varchar(255) NOT NULL,
  `status` varchar(255),
  `weight` varchar(255),
  `temperature` varchar(255),
  `diagnosis` varchar(255),
  `treatment` varchar(255),
  `price` double,
  `createdById` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `PrescriptionRecord` (
  `id` varchar(255) NOT NULL,
  `recordId` varchar(255) NOT NULL,
  `createdById` varchar(255) NOT NULL,
  `medicationName` varchar(255) NOT NULL,
  `dosage` varchar(255) NOT NULL,
  `instructions` varchar(255),
  PRIMARY KEY (`id`)
);

CREATE TABLE `FormType` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Form` (
  `id` varchar(255) NOT NULL,
  `petId` varchar(255) NOT NULL,
  `formTypeId` varchar(255) NOT NULL,
  `formDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `ItemType` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Inventory` (
  `id` varchar(255) NOT NULL,
  `itemName` varchar(255) NOT NULL,
  `itemTypeId` varchar(255) NOT NULL,
  `stock` int NOT NULL,
  `status` varchar(255),
  PRIMARY KEY (`id`)
);

CREATE TABLE `ReminderType` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `SmsReminder` (
  `id` varchar(255) NOT NULL,
  `recordId` varchar(255) NOT NULL,
  `reminderTypeId` varchar(255) NOT NULL,
  `reminderDate` datetime NOT NULL,
  `message` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

-- Foreign Keys
ALTER TABLE `Staff` ADD CONSTRAINT `FK_Staff_Role` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`);
ALTER TABLE `Pet` ADD CONSTRAINT `FK_Pet_Owner` FOREIGN KEY (`ownerId`) REFERENCES `PetOwner`(`id`);
ALTER TABLE `ClinicalRecord` ADD CONSTRAINT `FK_CR_Pet` FOREIGN KEY (`petId`) REFERENCES `Pet`(`id`);
ALTER TABLE `ClinicalRecord` ADD CONSTRAINT `FK_CR_Purpose` FOREIGN KEY (`purposeId`) REFERENCES `PurposeOfVisit`(`id`);
ALTER TABLE `ClinicalRecord` ADD CONSTRAINT `FK_CR_Staff` FOREIGN KEY (`createdById`) REFERENCES `Staff`(`id`);
ALTER TABLE `PrescriptionRecord` ADD CONSTRAINT `FK_PR_CR` FOREIGN KEY (`recordId`) REFERENCES `ClinicalRecord`(`id`);
ALTER TABLE `PrescriptionRecord` ADD CONSTRAINT `FK_PR_Staff` FOREIGN KEY (`createdById`) REFERENCES `Staff`(`id`);
ALTER TABLE `Form` ADD CONSTRAINT `FK_Form_Pet` FOREIGN KEY (`petId`) REFERENCES `Pet`(`id`);
ALTER TABLE `Form` ADD CONSTRAINT `FK_Form_Type` FOREIGN KEY (`formTypeId`) REFERENCES `FormType`(`id`);
ALTER TABLE `Inventory` ADD CONSTRAINT `FK_Inv_Type` FOREIGN KEY (`itemTypeId`) REFERENCES `ItemType`(`id`);
ALTER TABLE `SmsReminder` ADD CONSTRAINT `FK_SMS_CR` FOREIGN KEY (`recordId`) REFERENCES `ClinicalRecord`(`id`);
ALTER TABLE `SmsReminder` ADD CONSTRAINT `FK_SMS_Type` FOREIGN KEY (`reminderTypeId`) REFERENCES `ReminderType`(`id`);
