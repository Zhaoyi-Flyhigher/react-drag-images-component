import { moduleTools, defineConfig } from '@modern-js/module-tools';

export default defineConfig({
  buildConfig: {
    // 避免打包 React
    externals: ['react', 'react-dom'],
  },
  plugins: [moduleTools()],
  buildPreset: 'npm-library',
});