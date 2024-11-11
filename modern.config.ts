import { moduleTools, defineConfig } from '@modern-js/module-tools';
import sass from "sass"
export default defineConfig({
  buildConfig: {
    style: {
      sass: {
        implementation: sass,
      },
      inject: true,
    },
    minify: {
      compress: {
        drop_console: true,
      },
    },
    // 避免打包 React
    externals: ['react', 'react-dom'],
  },
  plugins: [moduleTools()],
  buildPreset: 'npm-library',
});