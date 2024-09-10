import api from "src/lib/axios";

const createRole = async (data) => {
  try {
    const response = await api.post("/roles", { ...data });

    if (!response.data.role) {
      throw new Error("Error creating role. Please try again.");
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

export default createRole;