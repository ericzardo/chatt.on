import api from "src/lib/axios";

const createPermission = async (permission) => {

  try {
    const response = await api.post("/permissions", permission);

    if (!response.data) {
      throw new Error("Error creating new permission. Please try again.");
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

export default createPermission;