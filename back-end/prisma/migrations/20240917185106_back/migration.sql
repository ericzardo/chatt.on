/*
  Warnings:

  - You are about to drop the column `banner_image_id` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `files` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `banner_image_url` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `chats` DROP FOREIGN KEY `chats_banner_image_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_profile_picture_id_fkey`;

-- AlterTable
ALTER TABLE `chats` DROP COLUMN `banner_image_id`,
    ADD COLUMN `banner_image_url` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `profile_picture_id`,
    ADD COLUMN `profile_picture_url` VARCHAR(191) NOT NULL DEFAULT 'https://mentesmart.com.br/src/assets/img/clients/1.jpeg';

-- DropTable
DROP TABLE `files`;
