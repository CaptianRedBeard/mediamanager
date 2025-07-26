import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // Outputs the build files to the 'dist' directory
    assetsDir: 'assets', // Keeps assets (JS, CSS, images) in the 'assets' folder
    rollupOptions: {
      input: {
        // Entry points for both the homepage and the upload page
        main: './index.html',
        upload: './upload.html'
      }
    }
  }
});
