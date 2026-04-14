import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://192.168.1.10:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

export const mlClient = axios.create({
  baseURL: "http://192.168.1.10:5000",
  headers: {
    "Content-Type": "application/json",
  },
});
