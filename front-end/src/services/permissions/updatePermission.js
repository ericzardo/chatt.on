import api from "src/lib/axios";

const updatePermission = async (permission, data) => {

  try {
    const response = await api.patch(`/permissions/${permission.id}`, { ...data });

    if (!response.data) {
      throw new Error("Error saving changes on permission. Please try again.");
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

export default updatePermission;