/*
  Warnings:

  - You are about to drop the column `transaction_cursor` on the `Item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[plaid_transaction_id]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Item` DROP COLUMN `transaction_cursor`,
    ADD COLUMN `transactions_cursor` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Transaction_plaid_transaction_id_key` ON `Transaction`(`plaid_transaction_id`);
