import api from "src/lib/axios";

const getThemes = async (page = null, perPage = null) => {
  const params = {};

  if (page && perPage) {
    params.page = page;
    params.perPage = perPage;
  }

  try {
    const response = await api.get("/themes", { params });

    if (!response.data || !response.data.themes) {
      throw new Error("Error getting themes data. Please try again.");
    }

    return response.data.themes;
  } catch (err) {

    if (!err.response) {
      console.log(err);
      throw new Error("Server did not respond. Please try later");
    }
    const { message } = err.response.data;
    throw new Error(message);
  }
};

export default getThemes;