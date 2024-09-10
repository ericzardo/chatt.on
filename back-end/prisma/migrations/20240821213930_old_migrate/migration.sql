/*
  Warnings:

  - You are about to drop the column `chatId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `UserChat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserChat` DROP FOREIGN KEY `UserChat_chatId_fkey`;

-- DropForeignKey
ALTER TABLE `UserChat` DROP FOREIGN KEY `UserChat_userId_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_chatId_fkey`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `chatId`;

-- DropTable
DROP TABLE `UserChat`;

-- CreateTable
CREATE TABLE `_UserChats` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_UserChats_AB_unique`(`A`, `B`),
    INDEX `_UserChats_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserChats` ADD CONSTRAINT `_UserChats_A_fkey` FOREIGN KEY (`A`) REFERENCES `chats`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserChats` ADD CONSTRAINT `_UserChats_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
