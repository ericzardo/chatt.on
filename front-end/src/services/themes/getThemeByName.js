import api from "src/lib/axios";

const getThemeByName = async (themeName) => {

  try {
    const response = await api.get(`/themes/${themeName}`);

    if (!response.data || !response.data.theme) {
      throw new Error("Error fetching theme. Please try again.");
    }

    return response.data.theme;
  } catch (err) {
    if (!err.response) {
      throw new Error("Server did not respond. Please try later");
    }

    const { message } = err.response.data;
    throw new Error(message);
  }
};

export default getThemeByName;