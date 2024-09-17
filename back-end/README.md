
```
back-end
├─ .env
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ migrations
│  │  ├─ 20240816125640_init
│  │  │  └─ migration.sql
│  │  ├─ 20240819153140_update
│  │  │  └─ migration.sql
│  │  ├─ 20240819155841_update
│  │  │  └─ migration.sql
│  │  ├─ 20240819234940_update
│  │  │  └─ migration.sql
│  │  ├─ 20240820014702_update
│  │  │  └─ migration.sql
│  │  ├─ 20240821205950_create
│  │  │  └─ migration.sql
│  │  ├─ 20240821213930_old_migrate
│  │  │  └─ migration.sql
│  │  ├─ 20240903162832_create
│  │  │  └─ migration.sql
│  │  ├─ 20240905023817_update
│  │  │  └─ migration.sql
│  │  ├─ 20240906022722_update
│  │  │  └─ migration.sql
│  │  ├─ 20240911002430_add_color_to_roles
│  │  │  └─ migration.sql
│  │  ├─ 20240911214009_add
│  │  │  └─ migration.sql
│  │  ├─ 20240912002908_auto
│  │  │  └─ migration.sql
│  │  ├─ 20240912010337_undo
│  │  │  └─ migration.sql
│  │  ├─ 20240913000301_create
│  │  │  └─ migration.sql
│  │  ├─ 20240913001806_undo
│  │  │  └─ migration.sql
│  │  ├─ 20240913002119_create
│  │  │  └─ migration.sql
│  │  ├─ 20240913002824_update
│  │  │  └─ migration.sql
│  │  ├─ 20240913010733_update
│  │  │  └─ migration.sql
│  │  ├─ 20240913012253_undo
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  ├─ schema.prisma
│  └─ scripts
│     ├─ seed-admin.js
│     ├─ seed-roles.js
│     └─ seed-rooms.js
├─ src
│  ├─ config
│  │  └─ index.js
│  ├─ controllers
│  │  ├─ chatController.js
│  │  ├─ connectionController.js
│  │  └─ events
│  │     ├─ disconnect.js
│  │     ├─ joinChat.js
│  │     ├─ leaveChat.js
│  │     ├─ sendMessage.js
│  │     ├─ startWhisper.js
│  │     └─ utils
│  │        └─ chatHelper.js
│  ├─ error-handler.js
│  ├─ errors
│  │  └─ index.js
│  ├─ lib
│  │  ├─ io.js
│  │  ├─ mailer.js
│  │  └─ prisma.js
│  ├─ middleware
│  │  └─ authHandler.js
│  ├─ routes
│  │  ├─ auth
│  │  │  ├─ auth-login.js
│  │  │  ├─ auth-logout.js
│  │  │  ├─ auth-user.js
│  │  │  ├─ forgot-password.js
│  │  │  ├─ index.js
│  │  │  └─ reset-password.js
│  │  ├─ chats
│  │  │  ├─ create-chat.js
│  │  │  ├─ delete-chat.js
│  │  │  ├─ get-chat-by-name.js
│  │  │  ├─ get-chats.js
│  │  │  └─ index.js
│  │  ├─ index.js
│  │  ├─ permissions
│  │  │  ├─ get-permissions.js
│  │  │  └─ index.js
│  │  ├─ roles
│  │  │  ├─ create-role.js
│  │  │  ├─ delete-role.js
│  │  │  ├─ get-roles.js
│  │  │  ├─ index.js
│  │  │  ├─ update-role-permissions.js
│  │  │  ├─ update-role.js
│  │  │  └─ update-roles-levels.js
│  │  ├─ themes
│  │  │  ├─ create-theme.js
│  │  │  ├─ delete-theme.js
│  │  │  ├─ get-theme-by-name.js
│  │  │  ├─ get-themes.js
│  │  │  └─ index.js
│  │  └─ users
│  │     ├─ add-user-chat.js
│  │     ├─ create-user-with-chat.js
│  │     ├─ create-user.js
│  │     ├─ delete-user.js
│  │     ├─ get-users.js
│  │     ├─ index.js
│  │     ├─ remove-user-chat.js
│  │     ├─ update-profile-user.js
│  │     └─ update-user-roles.js
│  ├─ server.js
│  └─ services
│     ├─ ConnectionManager.js
│     └─ MessageManager.js
└─ yarn.lock

```