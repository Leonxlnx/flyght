import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                topgun: resolve(__dirname, 'films/top-gun-maverick/index.html'),
            },
        },
    },
});
