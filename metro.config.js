const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

if (process.env.NODE_ENV !== "production") {
  try {
    const { withNativeWind } = require("nativewind/metro");
    module.exports = withNativeWind(config, {
      input: "./global.css",
    });
  } catch (error) {
    console.log("Using default metro config");
    module.exports = config;
  }
} else {
  module.exports = config;
}
