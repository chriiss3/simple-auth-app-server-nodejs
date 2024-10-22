import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import babelParser from "@babel/eslint-parser";

const pluginOptions = {
  prettier: prettierPlugin,
  "import/parsers": babelParser,
};

const languageOptions = {
  globals: {
    ...globals.node,
  },
  ecmaVersion: "latest",
  sourceType: "module",
  parser: babelParser,
};

export default [
  { files: ["src/**/*.ts"] },
  {
    plugins: {
      ...pluginOptions,
    },
  },
  {
    languageOptions: {
      ...languageOptions,
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
];
