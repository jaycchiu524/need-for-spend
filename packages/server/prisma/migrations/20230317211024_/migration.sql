-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `role` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `id` VARCHAR(191) NOT NULL,
    `plaid_access_token` VARCHAR(191) NOT NULL,
    `plaid_item_id` VARCHAR(191) NOT NULL,
    `plaid_institution_id` VARCHAR(191) NOT NULL,
    `plaid_institution_name` VARCHAR(191) NOT NULL,
    `transactions_cursor` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `items_plaid_item_id_key`(`plaid_item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `item_id` VARCHAR(191) NOT NULL,
    `plaid_account_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `subtype` VARCHAR(191) NULL,
    `mask` VARCHAR(191) NULL,
    `official_name` VARCHAR(191) NULL,
    `balance_available` DOUBLE NULL,
    `balance_current` DOUBLE NULL,
    `balance_limit` DOUBLE NULL,
    `balance_iso_currency_code` VARCHAR(191) NULL,
    `balance_unofficial_currency_code` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `accounts_plaid_account_id_key`(`plaid_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `plaid_transaction_id` VARCHAR(191) NOT NULL,
    `account_id` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `datetime` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `iso_currency_code` VARCHAR(191) NULL,
    `unofficial_currency_code` VARCHAR(191) NULL,
    `plaid_category_id` VARCHAR(191) NULL,
    `pending` BOOLEAN NOT NULL,
    `account_owner` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `transactions_plaid_transaction_id_key`(`plaid_transaction_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `plaid_category_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `group` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`plaid_category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subcategories` (
    `name` VARCHAR(191) NOT NULL,
    `depth` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories_on_sub_categories` (
    `plaid_category_id` VARCHAR(191) NOT NULL,
    `subcategory_name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`plaid_category_id`, `subcategory_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_plaid_category_id_fkey` FOREIGN KEY (`plaid_category_id`) REFERENCES `categories`(`plaid_category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categories_on_sub_categories` ADD CONSTRAINT `categories_on_sub_categories_plaid_category_id_fkey` FOREIGN KEY (`plaid_category_id`) REFERENCES `categories`(`plaid_category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categories_on_sub_categories` ADD CONSTRAINT `categories_on_sub_categories_subcategory_name_fkey` FOREIGN KEY (`subcategory_name`) REFERENCES `subcategories`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Transaction col plaid_transaction_id collate with utf8_bin
ALTER TABLE `transactions` MODIFY COLUMN `plaid_transaction_id` VARCHAR(191) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL;