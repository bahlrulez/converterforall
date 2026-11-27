import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored WASM/worker assets and generated outputs:
    "public/**",
    "scratch/**",
    "test-results/**",
    "playwright-report/**",
    // Local ad-hoc scratch scripts ignored by .gitignore:
    "test-*.js",
    "test_*.js",
    "test.js",
  ]),
  {
    rules: {
      // Legacy codebase patterns surfaced at warning level so critical hook/link/type bugs stay hard errors:
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    files: ["src/lib/fonts/punjabi-engine.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "prefer-const": "off",
      "no-var": "off",
      "prefer-spread": "off",
      "prefer-rest-params": "off",
    },
  },
]);

export default eslintConfig;
