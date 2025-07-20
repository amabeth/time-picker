import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import unusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  {
    extends: fixupConfigRules(compat.extends("@react-native", "prettier")),
    plugins: { prettier, "unused-imports": unusedImports },
    rules: {
      "react/react-in-jsx-scope": "off",
      "prettier/prettier": [
        "warn",
        {
          quoteProps: "consistent",
          singleQuote: false,
          tabWidth: 2,
          trailingComma: "none",
          useTabs: false,
          semi: true,
          endOfLine: "crlf"
        }
      ],
      "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_",
        },
      ]
    }
  },
  {
    ignores: ["node_modules/", "lib/", "docs/", "eslint.config.mjs"]
  }
]);
