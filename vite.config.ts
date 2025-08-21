import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
import glsl from "vite-plugin-glsl";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Railway app domain - adjust if yours changes
const RAILWAY_HOST = "tictacpro-production-1824.up.railway.app";

export default defineConfig({
  plugins: [react(), runtimeErrorOverlay(), glsl()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  server: {
    port: Number(process.env.PORT) || 3000,
    host: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  preview: {
    port: Number(process.env.PORT) || 3000,
    host: true,
    allowedHosts: [RAILWAY_HOST],
    headers: {
      // Allow framing from your parent domains
      "Content-Security-Policy": "frame-ancestors 'self' https://learnforfun.kids https://learn-for-fun.replit.app",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*"
    }
  },
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  },
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.mp3", "**/*.ogg", "**/*.wav"]
});
