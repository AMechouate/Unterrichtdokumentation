import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Unterrichtsdokumentation/",
  plugins: [react()],
  build: {
    outDir: "pages-dist",
    emptyOutDir: true,
    target: "es2015",
    cssTarget: "safari12",
  },
  server: {
    host: "127.0.0.1",
  },
});
