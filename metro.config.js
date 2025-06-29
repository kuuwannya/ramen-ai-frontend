const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// ソースファイル拡張子の設定
config.resolver.sourceExts.push("css");

// 本番環境でのみNativeWindを適用
if (process.env.NODE_ENV === "production") {
  module.exports = withNativeWind(config, {
    input: "./global.css",
    configPath: "./tailwind.config.js",
  });
} else {
  module.exports = config;
}
