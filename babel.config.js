module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
    plugins: [
      "nativewind/babel",
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@lib": "./lib",
            "@components": "./components",
          },
        },
      ],
    ],
  };
};
