import axios from "axios";

import useAuthStore from "../store/authStore";
import { showError } from "../utils/toast";

const http = axios.create({
  baseURL: "http://localhost:3000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// Request Interceptor
// ==============================

http.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// ==============================
// Response Interceptor
// ==============================

http.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response) {
      const status = error.response.status;

      // Unauthorized

      if (status === 401) {
        showError("Session expired. Please login again");

        localStorage.removeItem("auth-storage");

        window.location.href = "/login";
      }

      // Server Error

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
