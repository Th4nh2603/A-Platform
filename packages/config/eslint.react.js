const globals = require("globals");
const reactHooks = require("eslint-plugin-react-hooks");
const baseConfig = require("./eslint.base.js");

function createReactConfig({
  files = ["**/*.{js,jsx,ts,tsx}"],
  jsxFiles = ["**/*.{jsx,tsx}"],
  includeBase = true
} = {}) {
  return [
    ...(includeBase ? baseConfig : []),
    {
      files,
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.es2022
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        }
      }
    },
    {
      files: jsxFiles,
      plugins: {
        "react-hooks": reactHooks
      },
      rules: {
        ...reactHooks.configs.recommended.rules
      }
    }
  ];
}

module.exports = createReactConfig();
module.exports.createReactConfig = createReactConfig;
