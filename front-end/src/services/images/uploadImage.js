import axios from "axios";

const uploadImage = async (presignedUrl, file) => {
  try {
    const response = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      }
    });
    console.log(response);
    if (!response.status === 200) {
      throw new Error("Failed to upload image. Please try again.");
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

export default uploadImage ;