// @ts-check
const tseslintParser = require("@typescript-eslint/parser");
const eslint = require("@eslint/js");
const angular = require("@angular-eslint/eslint-plugin");
const security = require("eslint-plugin-security");
const htmlPlugin = require("eslint-plugin-html");

module.exports = [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        ecmaVersion: 2020,
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      "@angular-eslint": angular,
      security: security,
    },
    rules: {
      // Bonnes pratiques Angular
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          style: "kebab-case",
        },
      ],

      // Règles TypeScript strictes
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-assertions": "error",

      // Règles de sécurité
      "security/detect-object-injection": "error",
      "security/detect-eval-with-expression": "error",

      // Autres règles de style
      "prefer-const": "error",
    },
  },
  {
    files: ["**/*.html"],
    plugins: {
      "@angular-eslint/template": require("@angular-eslint/eslint-plugin-template"),
      "html": htmlPlugin,
    },
    rules: {
      "@angular-eslint/template/no-call-expression": "error",
    },
  },
];