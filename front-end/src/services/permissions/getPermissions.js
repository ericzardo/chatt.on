import api from "src/lib/axios";

const getPermissions = async (page = null, perPage = null) => {
  const params = {};

  if (page && perPage) {
    params.page = page;
    params.perPage = perPage;
  }

  try {
    const response = await api.get("/permissions", { params });

    if (!response.data.permissions) {
      throw new Error("Failed to fetch permissions. Please try again.");
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

export default getPermissions;