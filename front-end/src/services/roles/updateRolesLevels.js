import api from "src/lib/axios";

const updateRolesLevels = async (data) => {
  console.log(data);
  try {
    const response = await api.put("/roles/levels", { roles: data });

    if (!response.data) {
      throw new Error("Error updating roles hierarchy. Please try again.");
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

export default updateRolesLevels;