import js from "@eslint/js";
import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const globalIgnorePatterns = [
  "**/data/**/*",
  "**/node_modules/**/*",
  "**/.next/**/*",
  "**/dist/**/*",
  "**/.turbo/**/*",
];

export default [
  {
    ignores: globalIgnorePatterns,
  },
  {
    ...js.configs.recommended,
    files: ["**/*.js", "**/*.jsx"],
    ignores: globalIgnorePatterns,
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      indent: ["error", 2],
      quotes: ["error", "double"],
      "no-unused-vars": "error",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx", ""],
    ignores: globalIgnorePatterns,
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
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
];
