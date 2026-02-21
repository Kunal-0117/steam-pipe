import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

export const makeRequest = axios.create({
  baseURL: API_BASE_URL,
  paramsSerializer: {
    indexes: null,
  },
});

// ─── Request interceptor — inject Cognito IdToken ──────────────────────────
makeRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("id_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor — normalize error messages ──────────────────────
makeRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    const defaultErrorMessage =
      "Oops! Something went wrong. Please try again later.";
    error.message = defaultErrorMessage;

    if (error.response?.data?.message || error.response?.data?.detail) {
      const message = error.response.data.message || error.response.data.detail;
      error.message = message;
    } else if (error.response) {
      switch (error.response.data?.statusCode ?? error.response.status) {
        case 400:
          error.message =
            "The request was invalid. Please check your input and try again.";
          break;

        case 401:
          // Clear stale token and redirect to login
          localStorage.removeItem("id_token");
          localStorage.removeItem("auth_user");
          window.location.href = "/auth/login";
          error.message =
            "Your session has expired. Please log in again.";
          break;

        case 403:
          error.message =
            "You don't have permission to perform this action. Please contact support if you believe this is a mistake.";
          break;

        case 404:
          error.message = "The resource you requested could not be found.";
          break;

        case 429:
          error.message =
            "You're sending too many requests. Please slow down and try again after sometime.";
          break;

        case 500:
          error.message =
            "Something went wrong on our end. Please try again later, and we apologize for the inconvenience.";
          break;

        case 503:
          error.message =
            "Our servers are busy right now. Please try again later, and we apologize for the inconvenience.";
          break;

        case 504:
          error.message =
            "The request timed out. Please try again later, and we apologize for the inconvenience.";
          break;

        default:
          error.message = "Oops! Something went wrong. Please try again later.";
          break;
      }
    } else if (error.request) {
      error.message =
        "Network error: We couldn't reach the server. Please check your internet connection and try again.";
    } else {
      error.message = `An unexpected error occurred: ${error.message}`;
    }

    if (typeof error.message !== "string") {
      error.message = defaultErrorMessage;
    }

    throw error;
  },
);
