import api from "src/lib/axios";

const authLogout = async () => {
  try {
    const response = await api.post("/auth/logout");

    if (!response.data) {
      throw new Error("Logout failed");
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

export default authLogout;