import api from "src/lib/axios";

const deletePermission = async (permission) => {
  try {
    const response = await api.delete(`/permissions/${permission.id}`);
    
    if (!response.data) {
      throw new Error("Error deleting permission. Please try again.");
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

export default deletePermission;