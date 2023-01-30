/*
  Warnings:

  - You are about to drop the column `next_cursor` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[plaid_item_id]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transaction_cursor` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Account` MODIFY `subtype` VARCHAR(191) NULL,
    MODIFY `mask` VARCHAR(191) NULL,
    MODIFY `official_name` VARCHAR(191) NULL,
    MODIFY `balance_available` DOUBLE NULL,
    MODIFY `balance_current` DOUBLE NULL,
    MODIFY `balance_limit` DOUBLE NULL,
    MODIFY `balance_iso_currency_code` VARCHAR(191) NULL,
    MODIFY `balance_unofficial_currency_code` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Item` ADD COLUMN `transaction_cursor` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `next_cursor`,
    MODIFY `address` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `iso_currency_code` VARCHAR(191) NULL,
    MODIFY `unofficial_currency_code` VARCHAR(191) NULL,
    MODIFY `plaid_category_id` VARCHAR(191) NULL,
    MODIFY `account_owner` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Item_plaid_item_id_key` ON `Item`(`plaid_item_id`);
