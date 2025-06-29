const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// ソースファイル拡張子の設定
config.resolver.sourceExts.push("css");

module.exports = withNativeWind(config, {
  input: "./global.css",
  configPath: "./tailwind.config.js",
});
