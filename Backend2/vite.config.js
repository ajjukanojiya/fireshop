import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({

   
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
    ],
     server: {
        port: 5173, // Vite dev server port
       proxy: {
     '/api': {
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
    secure: false,
    rewrite: path => path.replace(/^\/api/, '/api/v1') // add /v1
  },
},

    },
});
