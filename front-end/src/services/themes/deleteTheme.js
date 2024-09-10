import api from "src/lib/axios";

const deleteTheme = async (theme) => {

  try {
    const response = await api.delete(`/themes/${theme.id}`);

    if (!response.data) {
      throw new Error("Error deleting theme. Please try again.");
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

export default deleteTheme;