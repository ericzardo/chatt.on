const { findChatOrUser, isUserReadyToStartWhisper } = require("./utils/chatHelper")

const startWhisper = async (socket, user) => {
  const { targetUser } = await findChatOrUser(user.username);
  const isToStartWhisper = isUserReadyToStartWhisper(targetUser);

  if (!targetUser || !isToStartWhisper) {
    socket.emit("error", {
      message: "It's impossible to talk to this user right now"
    })

    return;
  };

  socket.emit("whisperStarted", { targetUser });
}

module.exports = startWhisper;