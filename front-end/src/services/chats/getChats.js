import api from "src/lib/axios";

const getChats = async (theme, page, perPage) => {

  if (!theme) {
    throw new Error("Theme not provided.");
  }

  const params = {};

  if (page && perPage) {
    params.page = page;
    params.perPage = perPage;
  }

  try {
    const response = await api.get(`${theme.id}/chats`);

    if (!response.data || !response.data.chats) {
      throw new Error("Error searching for chats. Please try again.");
    }

    return response.data.chats;
  } catch (err) {
    if (!err.response) {
      throw new Error("Server did not respond. Please try later");
    }

    const { message } = err.response.data;
    throw new Error(message);
  }
};

export default getChats;