const { findChatOrUser, isUserOnline } = require("./utils/chatHelper");
const logger = require("../../lib/logger");

const startWhisper = async (socket, user) => {
  logger.info(`${user.username} is attempting to start a whisper.`);

  const { targetUser } = await findChatOrUser(user.username);

  if (!targetUser) {
    logger.warn(`Failed to send message: ${user.username} could not find target user.`);
    socket.emit("error", {
      message: "It's impossible to talk to this user right now"
    })

    return;
  };

  const isOnline = isUserOnline(targetUser);

  if (!isOnline) {
    logger.warn(`${user.username} tried to whisper to offline user ${targetUser.username}.`);
    socket.emit("error", {
      message: "It is not possible to talk to a user offline"
    });
    return;
  }
  logger.info(`Whisper started between ${user.username} and ${targetUser.username}.`);
  socket.emit("whisperStarted", { targetUser });
}

module.exports = startWhisper;