import axios from "axios";

import useAuthStore from "../store/authStore";
import { showError } from "../utils/toast";

const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://ecommerce-mern-henna.vercel.app/api"
    : "http://localhost:3000/api");

const http = axios.create({
  baseURL,

  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        showError("Session expired. Please login again");

        localStorage.removeItem("auth-storage");

        window.location.href = "/login";
      }

      if (status === 500) {
        showError("Server error. Please try again");
      }
    } else {
      showError("Network error");
    }

    return Promise.reject(error);
  },
);

export default http;
