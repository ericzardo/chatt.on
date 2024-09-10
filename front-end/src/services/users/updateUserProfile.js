import api from "src/lib/axios";

const updateUserProfile = async (data) => {

  try {
    const response = await api.patch("/users/profile", { ...data });

    if (!response.data) {
      throw new Error("Error saving changes on profile. Please try again.");
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

export default updateUserProfile;