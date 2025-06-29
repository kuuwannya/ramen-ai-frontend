module.exports = function (api) {
  api.cache(true);

  const plugins = [
    [
      "module-resolver",
      {
        root: ["."],
        alias: {
          "@lib": "./lib",
          "@components": "./components",
          "@hooks": "./hooks",
          "@types": "./types",
        },
      },
    ],
  ];

  // 本番環境でのみNativeWindのBabelプラグインを追加
  if (process.env.NODE_ENV === "production") {
    plugins.unshift("nativewind/babel");
  }

  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource:
            process.env.NODE_ENV === "production" ? "nativewind" : "react",
        },
      ],
    ],
    plugins,
  };
};
