const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.platforms = ["web", "ios", "android", "native"];
config.resolver.alias = {
  "react-native$": "react-native-web",
};

module.exports = withNativeWind(config, { input: "./global.css" });
