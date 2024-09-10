import api from "src/lib/axios";

const authLogin = async (loginData) => {
  try {
    const response = await api.post("/auth/login", loginData);

    if (!response.data || !response.data.accessToken) {
      throw new Error("Authentication error");
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

export default authLogin;