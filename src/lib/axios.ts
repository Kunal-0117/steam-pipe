import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

export const makeRequest = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true,
  paramsSerializer: {
    indexes: null,
  },
});

makeRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    const defaultErrorMessage =
      "Oops! Something went wrong. Please try again later.";
    error.message = defaultErrorMessage;

    if (error.response?.data?.message) {
      const message = error.response.data.message;
      //show only first message, we will see how to handle multiple server errors
      if (typeof message === "string") error.message = message;
      // who knows if this ends up being an array
      else if (Array.isArray(message))
        error.message = message?.[0] ?? defaultErrorMessage;
    } else if (error.response?.data?.messages) {
      const messages = error.response.data.messages;
      //Need to handle this error type.
      if (typeof messages === "string") error.message = messages;
      else if (Array.isArray(messages)) {
        //show only first message, we will see how to handle multiple server errors
        if (typeof messages[0] === "string") error.message = messages[0];
        else error.message = messages[0]?.description ?? defaultErrorMessage;
      }
    } else if (error.response) {
      switch (error.response.data?.statusCode ?? error.response.status) {
        case 400:
          error.message =
            "The request was invalid. Please check your input and try again.";
          break;

        case 401:
          error.message =
            "You need to log in to access this resource. Please log in and try again.";
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

    throw error;
  },
);
