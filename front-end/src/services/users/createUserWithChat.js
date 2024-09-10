import api from "src/lib/axios";

const createUserWithChat = async (data, chat) => {

  try {
    const response = await api.post(`/users/${chat.id}`, data);

    if (!response.data) {
      throw new Error("Failed to create user and connect to chat. Please try again");
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

export default createUserWithChat;