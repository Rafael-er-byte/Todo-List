import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  {
    ignores: [
      "jest.config.js",
      "prettier.config.js",
      "**/dist/**",
      "node_modules/**/*",
    ],

    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],

    plugins: {
      js,
    },

    extends: ["js/recommended"],

    languageOptions: {
      globals: globals.browser,

      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
  },

  tseslint.configs.recommended,
]);