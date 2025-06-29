const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// ソースファイル拡張子の設定
config.resolver.sourceExts.push("css");

// アセットファイル拡張子の設定
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "svg",
];

// Transformerの設定
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

// SVGファイルをアセットから除外
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg",
);
config.resolver.sourceExts.push("svg");

module.exports = withNativeWind(config, {
  input: "./global.css",
  configPath: "./tailwind.config.js",
});
