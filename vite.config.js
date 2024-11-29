import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';


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
        postcss: {
            plugins: [
                tailwindcss,
                autoprefixer
            ]
        }
    },
    plugins: [
        {
            name: 'scss-to-css',
            apply: 'build',
            enforce: 'post',
            generateBundle() {
                const { execSync } = require('child_process');
                execSync('npx tailwindcss -i ./src/css/main.scss -o ./styles/main.min.css --minify');
            }
        }
    ]
});
