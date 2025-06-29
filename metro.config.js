const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// 本番環境でのみNativeWindを適用
module.exports = withNativeWind(config, {
  input: "./global.css",
  configPath: "./tailwind.config.js",
});
