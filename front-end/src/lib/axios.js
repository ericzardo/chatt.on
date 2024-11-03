import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

console.log(import.meta.env);

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
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