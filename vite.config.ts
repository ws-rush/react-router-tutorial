import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import remixRouter from "unplugin-remix-router/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), remixRouter()],
});
