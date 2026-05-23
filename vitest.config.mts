import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    coverage: {
      exclude: [
        "src/app/generated/**",
        "node_modules/**",
        ".next/**",
        "coverage/**",
      ],
    },
    alias: {
      // Vitest tidak baca __mocks__ otomatis seperti Jest
      "server-only": fileURLToPath(
        new URL("./__mocks__/server-only.ts", import.meta.url),
      ),
      // Fallback mock untuk test yang perlu menghindari import server-only dari baseline service
      "@/lib/baseline/service": fileURLToPath(
        new URL("./__mocks__/baseline-service.ts", import.meta.url),
      ),
    },
  },
});
