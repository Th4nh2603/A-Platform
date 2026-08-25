const globals = require("globals");
const baseConfig = require("./eslint.base.js");

module.exports = [
  ...baseConfig,
  {
    files: ["**/*.{js,cjs,mjs,ts,mts,cts}"],
    languageOptions: {
      globals: {
        ...globals.es2024,
        ...globals.node
      }
    },
    rules: {
      "no-console": "off"
    }
  }
];
