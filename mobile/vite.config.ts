import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
export default defineConfig({
  root: import.meta.dirname,
  base: "./",
  publicDir: false,
  plugins: [react()],
  resolve: { dedupe: ["react", "react-dom"] },
  build: {
    outDir: path.resolve(
      import.meta.dirname,
      "android/app/src/main/assets/app"
    ),
    emptyOutDir: true,
  },
});
