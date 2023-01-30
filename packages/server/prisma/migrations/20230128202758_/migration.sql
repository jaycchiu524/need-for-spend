/*
  Warnings:

  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `role` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `Item` (
    `id` VARCHAR(191) NOT NULL,
    `plaid_access_token` VARCHAR(191) NOT NULL,
    `plaid_item_id` VARCHAR(191) NOT NULL,
    `plaid_institution_id` VARCHAR(191) NOT NULL,
    `plaid_institution_name` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `item_id` VARCHAR(191) NOT NULL,
    `plaid_account_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `subtype` VARCHAR(191) NOT NULL,
    `mask` VARCHAR(191) NOT NULL,
    `official_name` VARCHAR(191) NOT NULL,
    `balance_available` DOUBLE NOT NULL,
    `balance_current` DOUBLE NOT NULL,
    `balance_limit` DOUBLE NOT NULL,
    `balance_iso_currency_code` VARCHAR(191) NOT NULL,
    `balance_unofficial_currency_code` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` VARCHAR(191) NOT NULL,
    `plaid_transaction_id` VARCHAR(191) NOT NULL,
    `account_id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `iso_currency_code` VARCHAR(191) NOT NULL,
    `unofficial_currency_code` VARCHAR(191) NOT NULL,
    `plaid_category_id` VARCHAR(191) NOT NULL,
    `next_cursor` VARCHAR(191) NOT NULL,
    `pending` BOOLEAN NOT NULL,
    `account_owner` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
