import api from "src/lib/axios";

const getAvatars = async () => {
  try {
    const response = await api.get("/uploads/avatars");
    
    if (!response.data.avatars) {
      throw new Error("Failed to fetch avatars list. Please try again.");
    }

    return response.data.avatars;
  } catch (err) {
    if (!err.response) {
      throw new Error("Server did not respond. Please try later");
    }

    const { message } = err.response.data;
    throw new Error(message);
  }
};

export default getAvatars;