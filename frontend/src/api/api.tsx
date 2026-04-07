// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://todo-fullstack-12.onrender.com",
});
export default api;