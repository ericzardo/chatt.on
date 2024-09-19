import api from "src/lib/axios";

const getRolePermissions = async (role) => {
  try {
    const response = await api.get(`/roles/${role.id}/permissions`);

    if (!response.data.permissions) {
      throw new Error("Error searching roles. Please try again.");
    }

    return response.data.permissions;
  } catch (err) {
    if (!err.response) {
      throw new Error("Server did not respond. Please try later");
    }

    const { message } = err.response.data;
    throw new Error(message);
  }
};

export default getRolePermissions;