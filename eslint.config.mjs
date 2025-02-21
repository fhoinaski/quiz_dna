// eslint.config.mjs
import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  extends: ["next/core-web-vitals"],
  rules: {
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  },
  ignores: ["node_modules/**", ".next/**", "public/**"]
});