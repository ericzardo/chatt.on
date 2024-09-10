-- CreateTable
CREATE TABLE `temporary_users` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `profile_picture_url` VARCHAR(191) NOT NULL DEFAULT 'https://mentesmart.com.br/src/assets/img/clients/1.jpeg',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_id_fkey` FOREIGN KEY (`id`) REFERENCES `temporary_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
