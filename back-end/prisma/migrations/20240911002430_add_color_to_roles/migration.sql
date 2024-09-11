/*
  Warnings:

  - A unique constraint covering the columns `[color]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `color` to the `roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `roles` ADD COLUMN `color` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `roles_color_key` ON `roles`(`color`);
