import api from "src/lib/axios";

const removeUserChat = async (chat) => {

  try {
    const response = await api.delete(`/user-chats/${chat.id}`);

    if (!response.data) {
      throw new Error("Error removing chat. Please try again.");
    }

    return response.data;
  } catch (err) {
    if (!err.response) {
      throw new Error("Server did not respond. Please try later");
    }

    const { message } = err.response.data;
    throw new Error(message);
  }
};

export default removeUserChat;