
```
front-end
├─ .eslintrc.cjs
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
│  │  │  ├─ LabeledToggleSwitch
│  │  │  │  └─ index.jsx
│  │  │  ├─ Table
│  │  │  │  └─ index.jsx
│  │  │  └─ ToggleSwitch
│  │  │     └─ index.jsx
│  │  └─ utils
│  │     └─ GenerateForm.jsx
│  ├─ context
│  │  ├─ NavigationContext.jsx
│  │  ├─ NotificationContext.jsx
│  │  ├─ Providers.jsx
│  │  ├─ SocketContext.jsx
│  │  └─ UserContext.jsx
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
│  │        ├─ RolesManager
│  │        │  ├─ EditPermissions.jsx
│  │        │  ├─ EditRoleModal.jsx
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
│  │  ├─ roles
│  │  │  ├─ createRole.js
│  │  │  ├─ deleteRole.js
│  │  │  ├─ getRoles.js
│  │  │  └─ updateRolePermissions.js
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