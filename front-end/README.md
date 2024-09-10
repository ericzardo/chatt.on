
```
front-end
├─ .eslintrc.cjs
├─ .git
│  ├─ HEAD
│  ├─ branches
│  ├─ config
│  ├─ description
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  │  ├─ commit-msg.sample
│  │  ├─ fsmonitor-watchman.sample
│  │  ├─ post-update.sample
│  │  ├─ pre-applypatch.sample
│  │  ├─ pre-commit.sample
│  │  ├─ pre-merge-commit.sample
│  │  ├─ pre-push.sample
│  │  ├─ pre-rebase.sample
│  │  ├─ pre-receive.sample
│  │  ├─ prepare-commit-msg.sample
│  │  ├─ push-to-checkout.sample
│  │  └─ update.sample
│  ├─ index
│  ├─ info
│  │  └─ exclude
│  ├─ objects
│  │  ├─ info
│  │  └─ pack
│  │     ├─ pack-6d38e49f78a2baba64bbe89c32b1194e524bdc22.idx
│  │     └─ pack-6d38e49f78a2baba64bbe89c32b1194e524bdc22.pack
│  ├─ packed-refs
│  └─ refs
│     ├─ heads
│     │  └─ main
│     ├─ remotes
│     │  └─ origin
│     │     └─ HEAD
│     └─ tags
├─ .gitignore
├─ README.md
├─ index.html
├─ jsconfig.json
├─ package.json
├─ postcss.config.js
├─ src
│  ├─ components
│  │  ├─ ChatCard
│  │  │  ├─ Banner.jsx
│  │  │  ├─ Content.jsx
│  │  │  ├─ Infos.jsx
│  │  │  ├─ Root.jsx
│  │  │  └─ index.jsx
│  │  ├─ Header
│  │  │  ├─ AdminHeader.jsx
│  │  │  ├─ HamburguerMenu.jsx
│  │  │  ├─ Logo.jsx
│  │  │  ├─ Nav.jsx
│  │  │  ├─ NavMobile.jsx
│  │  │  ├─ Root.jsx
│  │  │  ├─ UserActions.jsx
│  │  │  ├─ UserDropdown.jsx
│  │  │  └─ index.jsx
│  │  ├─ Profile
│  │  │  ├─ EditProfile.jsx
│  │  │  └─ ProfileCard.jsx
│  │  ├─ RoleCard
│  │  │  └─ index.jsx
│  │  ├─ SideBarMenu.jsx
│  │  │  ├─ Nav.jsx
│  │  │  ├─ Root.jsx
│  │  │  ├─ Title.jsx
│  │  │  └─ index.jsx
│  │  ├─ modals
│  │  │  ├─ AlertModal
│  │  │  │  ├─ Content.jsx
│  │  │  │  ├─ ProgressBar.jsx
│  │  │  │  ├─ Root.jsx
│  │  │  │  └─ index.jsx
│  │  │  ├─ ConfirmDeleteModal
│  │  │  │  └─ index.jsx
│  │  │  ├─ ContainerModal
│  │  │  │  ├─ Root.jsx
│  │  │  │  ├─ Title.jsx
│  │  │  │  └─ index.jsx
│  │  │  └─ UsernameAndAvatarModal
│  │  │     ├─ AvatarSelection.jsx
│  │  │     ├─ Root.jsx
│  │  │     ├─ Title.jsx
│  │  │     ├─ UsernameForm.jsx
│  │  │     └─ index.jsx
│  │  ├─ skeleton
│  │  │  ├─ CardSkeleton.jsx
│  │  │  ├─ ListItemSkeleton.jsx
│  │  │  ├─ MessageSkeleton.jsx
│  │  │  ├─ TableSkeleton.jsx
│  │  │  └─ TextSkeleton.jsx
│  │  ├─ ui
│  │  │  ├─ Button
│  │  │  │  └─ index.jsx
│  │  │  ├─ Input
│  │  │  │  └─ index.jsx
│  │  │  ├─ LabeledInput
│  │  │  │  └─ index.jsx
│  │  │  └─ Table
│  │  │     └─ index.jsx
│  │  └─ utils
│  │     └─ GenerateForm.jsx
│  ├─ context
│  │  ├─ NavigationContext.jsx
│  │  ├─ NotificationContext.jsx
│  │  ├─ Providers.jsx
│  │  ├─ SocketContext.jsx
│  │  └─ UserContext.jsx
│  ├─ hooks
│  │  ├─ useNotification.jsx
│  │  ├─ useSocket.jsx
│  │  └─ useUser.jsx
│  ├─ index.css
│  ├─ lib
│  │  ├─ axios.js
│  │  └─ queryClient.js
│  ├─ main.jsx
│  ├─ middlewares
│  │  ├─ AdminProtection.jsx
│  │  └─ AuthProtection.jsx
│  ├─ pages
│  │  ├─ Chat
│  │  │  ├─ ChatBody.jsx
│  │  │  ├─ ChatHeader.jsx
│  │  │  ├─ ChatInfos.jsx
│  │  │  ├─ ChatSideBar.jsx
│  │  │  └─ index.jsx
│  │  ├─ Home
│  │  │  ├─ index.jsx
│  │  │  └─ steps
│  │  │     ├─ ChatSelection.jsx
│  │  │     └─ ThemeSelection.jsx
│  │  ├─ Sign
│  │  │  ├─ ForgotPassword
│  │  │  │  └─ index.jsx
│  │  │  ├─ In
│  │  │  │  └─ index.jsx
│  │  │  ├─ ResetPassword
│  │  │  │  └─ index.jsx
│  │  │  ├─ SignModal.jsx
│  │  │  └─ Up
│  │  │     └─ index.jsx
│  │  └─ admin
│  │     ├─ Home
│  │     │  └─ index.jsx
│  │     └─ sections
│  │        ├─ ChatsManager
│  │        │  └─ index.jsx
│  │        ├─ ThemesManager
│  │        │  └─ index.jsx
│  │        └─ UserManager
│  │           ├─ CreateUserModal.jsx
│  │           ├─ EditRolesModal.jsx
│  │           └─ index.jsx
│  ├─ routes.jsx
│  ├─ services
│  │  ├─ auth
│  │  │  ├─ authLogin.js
│  │  │  ├─ authLogout.js
│  │  │  ├─ authUser.js
│  │  │  ├─ forgotPassword.js
│  │  │  └─ resetPassword.js
│  │  ├─ chats
│  │  │  ├─ createChat.js
│  │  │  ├─ deleteChat.js
│  │  │  ├─ getChatByName.js
│  │  │  └─ getChats.js
│  │  ├─ getRoles.js
│  │  ├─ themes
│  │  │  ├─ createTheme.js
│  │  │  ├─ deleteTheme.js
│  │  │  ├─ getThemeByName.js
│  │  │  └─ getThemes.js
│  │  └─ users
│  │     ├─ addUserChat.js
│  │     ├─ createUser.js
│  │     ├─ createUserWithChat.js
│  │     ├─ deleteUser.js
│  │     ├─ getUsers.js
│  │     ├─ removeUserChat.js
│  │     ├─ updateUserProfile.js
│  │     └─ updateUserRoles.js
│  └─ utils
│     └─ toggleTheme.js
├─ tailwind.config.js
├─ vite.config.js
└─ yarn.lock

```