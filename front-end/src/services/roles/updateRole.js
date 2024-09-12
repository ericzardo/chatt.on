import api from "src/lib/axios";

const updateRole = async (role, data) => {
  try {
    const response = await api.patch(`/roles/${role.id}`, { ...data });

    if (!response.data) {
      throw new Error("Error updating role. Please try again.");
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

export default updateRole;