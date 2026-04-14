import axios from "axios";
import { getBaseApiUrl } from "./apiUrl";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import { API_CONFIG } from "./config";
import { showErrorToast } from "../ToastManager";

const apiClient = axios.create({
  baseURL: getBaseApiUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token: string | null = API_CONFIG.TOKEN;

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
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      "Something went wrong";

      showErrorToast(message);

    return Promise.reject(error);
  }
);

export default apiClient;