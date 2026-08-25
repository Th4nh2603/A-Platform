# @repo/config

Shared TypeScript and ESLint presets for the AI Platform monorepo.

## TypeScript

Use the base config for shared strict defaults:

```json
{
  "extends": "@repo/config/tsconfig.base.json"
}
```

Use the Node config for API, Electron main process, scripts, tooling, and Node packages:

```json
{
  "extends": "@repo/config/tsconfig.node.json"
}
```

Use the React config for Web, Admin, and Electron renderer packages:

```json
{
  "extends": "@repo/config/tsconfig.react.json"
}
```

## ESLint

Reuse the flat config presets from package or app `eslint.config.js` files:

```js
module.exports = require("@repo/config/eslint/node");
```

```js
module.exports = require("@repo/config/eslint/react");
```
