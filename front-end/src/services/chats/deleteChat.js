import api from "src/lib/axios";

const deleteChat = async (theme, chat) => {

  try {
    const response = await api.delete(`/${theme.id}/chats/${chat.id}`);

    if (!response.data) {
      throw new Error("Error deleting chat. Please try again.");
    }

    return response.data.message;
  } catch (err) {
    if (!err.response) {
      throw new Error("Server did not respond. Please try later");
    }

    const { message } = err.response.data;
    throw new Error(message);
  }
};

export default deleteChat;