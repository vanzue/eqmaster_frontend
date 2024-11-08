import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import typescriptParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["src/**/*.{js,mjs,cjs,vue,ts,tsx}"], 
    languageOptions: {
      globals: globals.browser,
      parser: typescriptParser, 
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        parser: typescriptParser
      },
    },
  },
  ...pluginVue.configs["flat/essential"],
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-reserved-component-names": "warn",
      "vue/no-deprecated-destroyed-lifecycle": "warn",
      // 你可以在这里添加 TypeScript 相关的规则
    },
  },
];