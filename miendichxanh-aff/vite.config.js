import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
    base: command === 'serve' ? '' : '/Admin/tools/AffReward/',
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