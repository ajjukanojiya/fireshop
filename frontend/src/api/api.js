// frontend/src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  withCredentials: true, // necessary for Sanctum later
  headers: {
    Accept: "application/json",
  },
});

export default api;


