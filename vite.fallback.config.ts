import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "pages-dist",
    emptyOutDir: false,
    target: "es2015",
    cssTarget: "safari12",
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, "src/main.tsx"),
      name: "DocumentationApp",
      formats: ["iife"],
      fileName: () => "assets/fallback-app.js",
      cssFileName: "fallback-app",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
