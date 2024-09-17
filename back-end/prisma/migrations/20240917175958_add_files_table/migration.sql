/*
  Warnings:

  - You are about to drop the column `banner_image_url` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture_url` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[banner_image_id]` on the table `chats` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profile_picture_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `chats` DROP COLUMN `banner_image_url`,
    ADD COLUMN `banner_image_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `profile_picture_url`,
    ADD COLUMN `profile_picture_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `files` (
    `id` VARCHAR(191) NOT NULL,
    `file_key` VARCHAR(191) NOT NULL,
    `content_type` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `files_file_key_key`(`file_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `chats_banner_image_id_key` ON `chats`(`banner_image_id`);

-- CreateIndex
CREATE UNIQUE INDEX `users_profile_picture_id_key` ON `users`(`profile_picture_id`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_profile_picture_id_fkey` FOREIGN KEY (`profile_picture_id`) REFERENCES `files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chats` ADD CONSTRAINT `chats_banner_image_id_fkey` FOREIGN KEY (`banner_image_id`) REFERENCES `files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
