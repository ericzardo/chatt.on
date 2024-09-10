import axios from "axios";

const baseURL = "http://localhost:1337";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Access-Control-Allow-Origin": "*" }
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.error("Autenticação necessária.");
    } else {
      console.error("Ocorreu um erro:", error.message);
    }
    return Promise.reject(error);
  }
);


export default api;