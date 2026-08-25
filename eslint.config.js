const nodeConfig = require("@repo/config/eslint/node");
const { createReactConfig } = require("@repo/config/eslint/react");

const webReactConfig = createReactConfig({
  files: ["apps/web/src/**/*.{js,jsx,ts,tsx}"],
  jsxFiles: ["apps/web/src/**/*.{jsx,tsx}"],
  includeBase: false
});

module.exports = [...nodeConfig, ...webReactConfig];
