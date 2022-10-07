import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
// todo do the environments --
// dev mode should not use docker because the HMR api is shit with docker

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: true,
        port: 8080,
        proxy: {
            'localhost:8080': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
        fallback: { os: path.resolve('os-browserify/browser') },
    },
});
