import axios from "axios";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.apiUrl ||
  (Constants.executionEnvironment === "standalone"
    ? "https://ramen-ai-backend-service-943228427206.asia-northeast1.run.app/api/v1"
    : "https://ramen-ai-backend-service-943228427206.asia-northeast1.run.app/api/v1");

const BASE_URL =
  "https://ramen-ai-backend-service-943228427206.asia-northeast1.run.app";

// 画像URLを絶対URLに変換するヘルパー関数
const convertImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;

  // 既にhttp/httpsで始まる場合
  if (imageUrl.startsWith("http")) {
    // Google Cloud Storageの署名付きURLの場合、エンコーディングを確認
    if (imageUrl.includes("storage.googleapis.com")) {
      console.log("Google Cloud Storage URL detected:", imageUrl);
      // URLをそのまま返す（エンコーディングは既に正しい）
      return imageUrl;
    }
    return imageUrl;
  }

  // 相対パスの場合
  return `${BASE_URL}${imageUrl}`;
};

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

      // 画像URLを絶対URLに変換
      if (response.data.menus) {
        response.data.menus = response.data.menus.map((menu: any) => ({
          ...menu,
          image_url: convertImageUrl(menu.image_url),
        }));
      }

      console.log("Converted menu data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching menus:", error);
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
  sendRecommendedMenus: async (menuIds: number[]) => {
    try {
      console.log("Sending menu IDs:", menuIds);

      const response = await secureApiClient.post(
        "/recommended_menus",
        {
          menu_ids: menuIds,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending recommended menus:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
      throw error;
    }
  },
};
