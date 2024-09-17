/*
  Warnings:

  - You are about to drop the column `userId` on the `roles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `roles` DROP FOREIGN KEY `roles_userId_fkey`;

-- AlterTable
ALTER TABLE `roles` DROP COLUMN `userId`;
