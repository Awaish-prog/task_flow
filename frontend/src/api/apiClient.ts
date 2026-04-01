import axios from "axios";
import { apiUrl } from "./apiUrl";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

const apiClient = axios.create({
  baseURL: apiUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token: string | null = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data) {
      config.data = snakecaseKeys(config.data, { deep: true });
    }

    if (config.params) {
      config.params = snakecaseKeys(config.params, { deep: true });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    response.data = camelcaseKeys(response.data, { deep: true });
    return response.data;
  },
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;