export default {
  expo: {
    name: "ramen-ai-frontend",
    slug: "ramen-ai-frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./assets/favicon-ramen-ai.png",
      name: "ラーメンに愛(AI)を！",
      bundler: "metro",
      output: "static",
    },
    plugins: [
      "expo-router",
      [
        "expo-build-properties",
        {
          web: {
            babel: {
              include: ["nativewind/preset"],
            },
          },
        },
      ],
    ],
    extra: {
      router: {
        origin: false,
      },
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      baseUrl: process.env.EXPO_PUBLIC_BASE_URL,
    },
  },
};
