import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Corrected the target definition
        changeOrigin: true, // Adds support for changing the origin of the host header
        secure: false, // Skips SSL verification for development
      },
    },
  },
  plugins: [react()],
});
