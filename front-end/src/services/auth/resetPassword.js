import api from "src/lib/axios";

const resetPassword = async (token, passwordData) => {
  try {
    const response = await api.post("/reset-password", {...passwordData, token});

    if (!response.data) {
      throw new Error("Error changing your password. Please try again.");
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

export default resetPassword;