import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
// todo do the environments --
// dev mode should not use docker because the HMR api is shit with docker

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 8080,
        host: true,
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
