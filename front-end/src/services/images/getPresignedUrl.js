import api from "src/lib/axios";

const getPresignedUrl = async (data) => {
  try {
    const response = await api.post("/uploads", data);
    
    if (!response.data.signedUrl) {
      throw new Error("Failed to get presigned URL. Please try again.");
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

export default getPresignedUrl ;