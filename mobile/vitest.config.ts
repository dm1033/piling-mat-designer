import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    include: ["mobile/src/**/*.test.ts"],
    environment: "node",
    pool: "threads",
    poolOptions: { threads: { singleThread: true } },
  },
});
