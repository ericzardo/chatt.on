import api from "src/lib/axios";

const forgotPassword = async (accountData) => {

  try {
    const response = await api.post("/forgot-password", accountData);

    if (!response.data) {
      throw new Error("Error finding your account. Please try again.");
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

export default forgotPassword;