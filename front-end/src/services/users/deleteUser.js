import api from "src/lib/axios";

const deleteUser = async (user) => {

  try {
    const response = await api.delete(`/users/${user.id}`);

    if (!response.data) {
      throw new Error("Error deleting user. Please try again.");
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

export default deleteUser;