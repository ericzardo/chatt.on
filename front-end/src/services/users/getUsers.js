import api from "src/lib/axios";

const getUsers = async (page = null, perPage = null) => {
  const params = {};

  if (page && perPage) {
    params.page = page;
    params.perPage = perPage;
  }

  try {
    const response = await api.get("/users", { params });

    if (!response.data || !response.data.users) {
      throw new Error("Error getting users data. Please try again.");
    }

    return response.data.users;
  } catch (err) {
    if (!err.response) {
      throw new Error("Server did not respond. Please try later");
    }

    const { message } = err.response.data;
    throw new Error(message);
  }
};

export default getUsers;