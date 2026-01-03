import axios from "axios";

const base = import.meta.env.VITE_API_BASE || "/api/v1";

const api = axios.create({
  baseURL: base,
  withCredentials: true,
  headers: { Accept: "application/json" }
});


// if token exists in localStorage, set header
const token = localStorage.getItem("token");
if (token) api.defaults.headers.common["Authorization"] = "Bearer " + token;

export default api;
