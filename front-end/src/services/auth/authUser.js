import api from "src/lib/axios";

const authUser = async () => {
  try {
    const response = await api.get("/auth/user");

    if (!response.data) {
      throw new Error("Failed to fetch user information");
    }

    return response.data;
  } catch (err) {

    if (!err.response) {
      throw new Error("Server did not respond. Please try later");
    }

    return null;
  }
};

export default authUser;