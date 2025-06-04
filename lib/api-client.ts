import axios from "axios";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.apiUrl ||
  (Constants.executionEnvironment === "standalone"
    ? "https://your-production-api.com/api/v1"
    : "http://localhost:3000/api/v1");

export const secureApiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    adapter: "http",
    maxRedirects: 3,
    decompress: true,
  },
});

export const apiService = {
  getRandomMenus: async () => {
    try {
      const response = await secureApiClient.get("/random_menus");

      // if (!response.ok) {
      //   throw new Error(`API error: ${response.status}`);
      // }

      //const data = await response.data;
      return response.data;
    } catch (error) {
      return {
        menus: [
          {
            id: 999,
            name: "サンプルラーメン",
            genre_name: "ラーメン",
            noodle_name: "中太麺",
            soup_name: "醤油",
            image_url:
              "https://t4.ftcdn.net/jpg/02/13/73/65/360_F_213736517_nOggg1YoxSijwAjhtFXvERQs4eFeRTS4.jpg",
          },
        ],
      };
    }
  },
};
