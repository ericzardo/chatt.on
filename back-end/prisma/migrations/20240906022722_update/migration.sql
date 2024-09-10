-- DropForeignKey
ALTER TABLE `user_chat_activities` DROP FOREIGN KEY `user_chat_activities_chat_id_fkey`;

-- AddForeignKey
ALTER TABLE `user_chat_activities` ADD CONSTRAINT `user_chat_activities_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
