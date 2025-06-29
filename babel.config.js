module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // NativeWind用のプラグイン
      "nativewind/babel",
      // Reanimatedプラグイン（最後に配置）
      "react-native-reanimated/plugin",
    ],
  };
};
