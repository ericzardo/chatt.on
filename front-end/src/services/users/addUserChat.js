import api from "src/lib/axios";

const addUserChat = async (chat) => {

  try {
    const response = await api.post(`/user-chats/${chat.id}`);

    if (!response.data) {
      throw new Error("Error adding chat to user. Please try again.");
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

export default addUserChat;