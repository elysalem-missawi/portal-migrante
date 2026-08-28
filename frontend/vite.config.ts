import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// لا نستخدم @react-router/dev هنا
export default defineConfig({
  plugins: [tsconfigPaths()],
  server: { port: 5173 },
});
