-- DropForeignKey
ALTER TABLE `user_chat_activities` DROP FOREIGN KEY `user_chat_activities_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `user_chat_activities` ADD CONSTRAINT `user_chat_activities_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
