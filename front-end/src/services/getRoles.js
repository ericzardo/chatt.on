import api from "src/lib/axios";

const getRoles = async () => {
  try {
    const response = await api.get("/roles");

    if (!response.data || !response.data.roles) {
      throw new Error("Error searching roles. Please try again.");
    }

    return response.data.roles;
  } catch (err) {
    if (!err.response) {
      throw new Error("Server did not respond. Please try later");
    }

    const { message } = err.response.data;
    throw new Error(message);
  }
};

export default getRoles;