// @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: [
      ".output/**",
      ".nitro/**",
      "dist/**",
      "node_modules/**",
      "eslint.config.js",
      "prettier.config.js",
      "src/components/deprecated/**",
      "src/components/ui/**",
      "src/services/deprecated/**",
    ],
  },
  ...tanstackConfig,
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unnecessary-condition": "off",
    },
  },
];
