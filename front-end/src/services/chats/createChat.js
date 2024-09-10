import api from "src/lib/axios";

const createChat = async (theme, chatData) => {
  console.log(theme);
  try {
    const response = await api.post(`${theme.id}/chats`, chatData);

    if (!response.data) {
      throw new Error("Error creating new chat. Please try again.");
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

export default createChat;