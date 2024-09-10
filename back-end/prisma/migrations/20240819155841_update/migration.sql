/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `temporary_users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `temporary_users_username_key` ON `temporary_users`(`username`);
