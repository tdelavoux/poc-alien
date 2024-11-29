import { defineConfig } from 'vite';
import { resolve } from 'path';
import sass from 'sass';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/js/main.js')
            },
            output: {
                dir: 'scripts',
                entryFileNames: 'main.js',
                format: 'es'
            },
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                implementation: sass
            }
        }
    },
    plugins: [
        {
            name: 'scss-to-css',
            apply: 'build',
            enforce: 'post',
            generateBundle() {
                const { execSync } = require('child_process');
                execSync('sass src/css/main.scss styles/main.min.css --style=compressed');
            }
        }
    ]
});
