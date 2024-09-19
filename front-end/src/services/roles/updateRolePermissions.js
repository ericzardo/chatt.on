import api from "src/lib/axios";

const updateRolePermissions = async (role, data) => {
  try {
    const response = await api.patch(`/roles/${role.id}/permissions`, { ...data });

    if (!response.data) {
      throw new Error("Error updating role permissions. Please try again.");
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

export default updateRolePermissions;