import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "development" ? "/" : process.env.VITE_BASE_PATH || "/",
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("@react-three/fiber")) return "r3f-vendor";
          if (id.includes("@react-three/drei")) return "drei-vendor";
          if (id.includes("/three/src/renderers/")) return "three-renderer-vendor";
          if (id.includes("/three/src/materials/")) return "three-material-vendor";
          if (id.includes("/three/src/geometries/")) return "three-geometry-vendor";
          if (id.includes("/three/src/math/")) return "three-math-vendor";
          if (id.includes("/three/")) return "three-core-vendor";
          if (id.includes("@radix-ui")) return "radix-vendor";
          if (id.includes("framer-motion") || id.includes("gsap")) return "motion-vendor";
          if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) return "react-vendor";
          return "vendor";
        },
      },
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: true,
  }
});
