import js from "@eslint/js";
import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    rules: {
      indent: ["error", 2],
      quotes: ["error", "double"],
      "no-unused-vars": "error",
    },
    ignores: ["**/dist/*", ".turbo", "**/node_modules/*"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: ".",
        project: ["./tsconfig.json", "./packages/*/tsconfig.json"],
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    },
  },
];
