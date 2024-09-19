const { findChatOrUser, isUserOnline } = require("./utils/chatHelper")

const startWhisper = async (socket, user) => {
  const { targetUser } = await findChatOrUser(user.username);

  if (!targetUser) {
    socket.emit("error", {
      message: "It's impossible to talk to this user right now"
    })

    return;
  };

  const isOnline = isUserOnline(targetUser);

  if (!isOnline) {
    socket.emit("error", {
      message: "It is not possible to talk to a user offline"
    });
    return;
  }

  socket.emit("whisperStarted", { targetUser });
}

module.exports = startWhisper;