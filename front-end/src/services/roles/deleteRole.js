import api from "src/lib/axios";

const deleteRole = async (role) => {
  try {
    const response = await api.delete(`/roles/${role.id}`);

    if (!response.data) {
      throw new Error("Error deleting role. Please try again.");
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

export default deleteRole;