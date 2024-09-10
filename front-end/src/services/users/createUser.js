import api from "src/lib/axios";

const createUser = async (user) => {

  try {
    const response = await api.post("/users", user);

    if (!response.data) {
      throw new Error("Error creating new chat. Please try again.");
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

export default createUser;