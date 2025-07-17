import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", // Allows access from other devices on the LAN
    port: 5173, // Optional: Specify the port (default is 5173)
  },
  plugins: [react()],
});
