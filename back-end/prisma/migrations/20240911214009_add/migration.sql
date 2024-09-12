/*
  Warnings:

  - A unique constraint covering the columns `[level]` on the table `roles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `roles` ADD COLUMN `level` INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX `roles_level_key` ON `roles`(`level`);
