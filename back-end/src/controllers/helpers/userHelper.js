const prisma = require("../../lib/prisma");

const updateUserChatActivity = async (user, chat) => {
  if (user?.is_temporary_user || !chat) return;

  const userChat = user.chats.find(c => c.name === chat)

  await prisma.userChatActivity.update({
    where: {
      user_id_chat_id: {
        user_id: user.id,
        chat_id: userChat.id,
      },
    },
    data: { last_active: new Date() },
  });
}

module.exports = { updateUserChatActivity }