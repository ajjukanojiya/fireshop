import axios from "axios";

const base = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: base,
  withCredentials: true,
  headers: { Accept: "application/json" }
});


// if token exists in localStorage, set header
const token = localStorage.getItem("token");
if (token) api.defaults.headers.common["Authorization"] = "Bearer " + token;

export default api;


// import axios from "axios";

// const api = axios.create({
//   baseURL: '/api/v1',  // relative path → proxy will forward to backend
//   withCredentials: true,
 
// });
// console.log(baseURL);
// // attach token if exists
// const token = localStorage.getItem("token");
// if (token) api.defaults.headers.common["Authorization"] = "Bearer " + token;

// export default api;

