// .eslintrc.js
module.exports = {
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    parser: "@typescript-eslint/parser", // Define o parser para TypeScript
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    extends: [
      "next/core-web-vitals", // Configuração padrão do Next.js
      "plugin:@typescript-eslint/recommended", // Regras recomendadas do @typescript-eslint
    ],
    plugins: ["@typescript-eslint"], // Adiciona o plugin @typescript-eslint
    rules: {
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-explicit-any": "warn", // Define como aviso
      "@typescript-eslint/no-unused-vars": "error", // Define como erro
    },
  };