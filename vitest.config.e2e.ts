import { resolve } from "path";
import swc from "unplugin-swc";
import tsCOnfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.e2e-spec.ts"],
    exclude: ["**/node_modules/**, **/.git/**"],
    globals: true,
    root: "./",
    setupFiles: ['./test/setup-e2e.ts']
  },
  plugins: [
    tsCOnfigPaths(),
    swc.vite({
      module: { type: "es6" },
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, "./src"),
    },
  },
});
