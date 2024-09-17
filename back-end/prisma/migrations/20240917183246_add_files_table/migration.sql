/*
  Warnings:

  - You are about to drop the column `userId` on the `files` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `files` DROP FOREIGN KEY `files_userId_fkey`;

-- AlterTable
ALTER TABLE `files` DROP COLUMN `userId`;
