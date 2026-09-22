import { defineConfig } from "vitest/config";

// No plugins needed: Vite reads `"jsx": "react-jsx"` and the `@/*` alias from tsconfig.json.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // Every test lives in tests/, mirroring src/ (tests/lib/format.test.ts covers src/lib/format.ts).
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      // The gate grows with the migration: only code that already follows the new architecture is measured.
      include: [
        "src/lib/**",
        "src/hooks/**",
        "src/config/**",
        "src/components/kit/**",
        "src/components/shell/**",
        "src/features/**",
        "src/proxy.ts",
      ],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/data/**",
        // Presentational: a Swiper carousel and a static photo; jsdom cannot exercise them meaningfully.
        "src/features/auth/components/testimonial-panel.tsx",
        "src/features/auth/components/register-hero.tsx",
      ],
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
    },
  },
});
