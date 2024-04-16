// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // minify: 'terser',
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PanZoomControl',
      // the proper extensions will be added
      fileName: (format) => format === 'umd' ? `PanZoomControl.${format}.js` : 'PanZoomControl.min.js',
      formats: ['iife', 'umd']
    },
    terserOptions: {
      mangle: true
    }
  }
})
