import api from "src/lib/axios";

const updateUserRoles = async (data) => {
  const { user, roles } = data;

  try {
    const response = await api.put(`/users/${user.id}/roles`, { roles });

    if (!response.data) {
      throw new Error("Error updating user roles. Please try again.");
    }

    return response.data.message;
  } catch (err) {
    if (!err.response) {
      throw new Error("Server did not respond. Please try later");
    }

    const { message } = err.response.data;
    throw new Error(message);
  }
};

export default updateUserRoles;