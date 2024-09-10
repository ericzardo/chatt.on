import api from "src/lib/axios";

const getChatByName = async (chatName) => {

  try {
    const response = await api.get(`/chats/${chatName}`);

    if (!response.data || !response.data.chat) {
      throw new Error("Error fetching chat. Please try again.");
    }

    return response.data.chat;
  } catch (err) {
    if (!err.response) {
      throw new Error("Server did not respond. Please try later");
    }

    const { message } = err.response.data;
    throw new Error(message);
  }
};

export default getChatByName;