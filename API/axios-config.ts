import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.1.19:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

export const mlClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_ML_BASE_URL || "http://192.168.1.19:5000",
  headers: { "Content-Type": "application/json" },
});
