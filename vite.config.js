import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    target: "esnext",
    outDir: "dist",
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      formats: ["esm"],
      fileName: "index", // Name of the output file
    },
    rollupOptions: {
      // Exclude these dependencies from the build (not bundled)
      external: [
        "fs",
        "path",
        "url",
        "os",
        "puppeteer",
        "markdown-it",
        "yargs",
      ],
      input: path.resolve(__dirname, "src/index.js"),
    },
  },
  optimizeDeps: {
    // Ensure that Vite doesn't bundle these dependencies (external libraries)
    exclude: ["fs", "path", "url", "os", "puppeteer", "markdown-it", "yargs"],
  },
});
