// axiosInstance.js
import axios from "axios";
console.log(process.env.PUBLIC_URL)
// Create an axios instance with default settings
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // Set the base URL of your API
  timeout: 5000, // Set a timeout limit (e.g., 5 seconds)
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Request sent:", config);
    return config;
  },
  (error) => {
    // Handle request errors
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response received:", response);
    return response;
  },
  (error) => {
    // Handle response errors
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
