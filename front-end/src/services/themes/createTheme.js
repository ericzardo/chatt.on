import api from "src/lib/axios";

const createTheme = async (theme) => {

  try {
    const response = await api.post("/themes", theme);

    if (!response.data) {
      throw new Error("Error creating new theme. Please try again.");
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

export default createTheme;