import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const isDev = process.env.NODE_ENV !== 'production';
export default defineConfig(({ mode }) => {
  const isLog = mode === 'logger';
  return {
    worker: {
      format: 'es',
    },
    build: {
      minify: 'esbuild',
      sourcemap: true,
      cssCodeSplit: false,
      chunkSizeWarningLimit: 1000, // 提高警告阈值到 1000 KB
      rollupOptions: {
        input: isDev
          ? {
              demo: path.resolve(__dirname, '/demo/index.html'),
              lib: path.resolve(__dirname, '/src/index.ts'),
            }
          : path.resolve(__dirname, '/src/index.ts'),
        external: ['vitest'],
      },
      lib: {
        entry: path.resolve(__dirname, '/src/index.ts'),
        name: 'webElementPopover',
        formats: ['umd', 'es'],
        fileName: (format) => `lib.${format}.js`,
      },
    },
    define: {
      __LOGGER__: JSON.stringify(isLog),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'],
    },
    plugins: [dts({ outDir: 'dist', tsconfigPath: 'tsconfig.json', copyDtsFiles: true })],
  };
});
