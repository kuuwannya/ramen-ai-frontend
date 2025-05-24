import axios from "axios";
import Constants from "expo-constants";
import { secureStorage } from "./auth";

const API_URL =
  Constants.expoConfig?.extra?.apiUrl || "http://localhost:3000/api/v1";

export const secureApiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// リクエストインターセプター（認証トークン付与）
secureApiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await secureStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Token retrieval error:", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);
