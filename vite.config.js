import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'huez-utils',
      formats: ['es'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      external: [],
    },
  },
});
