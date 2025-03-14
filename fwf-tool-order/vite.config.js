import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  base: command === 'serve' ? '' : '/Admin/tools/1/',
  plugins: [react()],
  resolve: {
      alias: {
          src: "/src",
      },
  },
  server: {
      port: 3000,
      host: true
  },
}))
