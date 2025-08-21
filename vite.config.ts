export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    glsl()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  server: {
    port: Number(process.env.PORT) || 3000,
    host: true
  },
  preview: {
    port: Number(process.env.PORT) || 3000,
    host: true,
    allowedHosts: ["tictacpro-production-1824.up.railway.app"]
  },
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  },
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.mp3", "**/*.ogg", "**/*.wav"]
});
