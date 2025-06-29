module.exports = function (api) {
  api.cache(true);

  const plugins = [];

  // 開発環境でのみNativeWindを使用
  if (process.env.NODE_ENV !== "production") {
    plugins.push("nativewind/babel");
  }

  return {
    presets: ["babel-preset-expo"],
    plugins: plugins,
  };
};
