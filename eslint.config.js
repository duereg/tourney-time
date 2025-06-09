// eslint.config.js
const globals = require("globals");
const tseslint = require("typescript-eslint");
const eslintPluginReact = require("eslint-plugin-react");
const eslintPluginReactHooks = require("eslint-plugin-react-hooks");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = tseslint.config(
  {
    // Global ignores
    ignores: ["dist/", "docs/", "node_modules/", ".parcel-cache/", "*.log"],
  },
  // Base configurations (eslint recommended, typescript recommended)
  require("@eslint/js").configs.recommended, // eslint:recommended
  ...tseslint.configs.recommended, // plugin:@typescript-eslint/recommended

  // Configuration for React files (src/ui)
  {
    files: ["src/ui/**/*.{ts,tsx}"],
    plugins: {
      react: eslintPluginReact,
      "react-hooks": eslintPluginReactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      // Add any React specific rule overrides here
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Configuration for general TypeScript files (src, bin, test)
  {
    files: ["src/**/*.{ts,tsx}", "bin/**/*.ts", "test/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json", // Important for some TS rules
      },
      globals: { // Define globals based on file type context
        ...globals.node, // For bin, test, and general src TS files
        ...globals.es2020, // ES features
      },
    },
    rules: {
      // Custom rules from original .eslintrc.js
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-prototype-builtins": "off",
    },
  },
  // Mocha specific environment for test files
  {
    files: ["test/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": "off", // Allow chai assertions like expect(foo).to.be.ok;
    },
  },

  // Prettier config must be last to override other formatting rules
  eslintConfigPrettier // Turns off ESLint rules that conflict with Prettier
);
