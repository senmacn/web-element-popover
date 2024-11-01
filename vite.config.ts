import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  worker: {
    format: 'es',
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000, // 提高警告阈值到 1000 KB
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-antd': ['antd', '@ant-design/icons', '@antv/g6'],
          'vendor-charts': ['echarts'],
          'vendor-utils': ['axios', 'dayjs', 'i18next'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
  },
});
