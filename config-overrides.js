module.exports = function override(config) {
  const sourceMapLoader = config.module.rules.find(
    (rule) => rule.enforce === "pre" && rule.use?.[0] === "source-map-loader"
  );
  if (sourceMapLoader) {
    sourceMapLoader.exclude = [/stylis-plugin-rtl/];
  }
  return config;
};
