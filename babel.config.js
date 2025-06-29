module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
          web: {
            useTransformReactJSXExperimental: true,
          },
        },
      ],
    ],
    plugins: [
      "nativewind/babel",
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
    ],
    env: {
      production: {
        plugins: ["transform-remove-console"],
      },
    },
  };
};
