/*
  Warnings:

  - You are about to drop the `AccountHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AccountHistory` DROP FOREIGN KEY `AccountHistory_accountId_fkey`;

-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `errorMessage` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('SUCCESS', 'FAILED', 'PENDING') NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE `AccountHistory`;
