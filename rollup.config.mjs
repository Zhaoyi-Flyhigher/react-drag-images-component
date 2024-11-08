import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import url from '@rollup/plugin-url';
import {dts} from 'rollup-plugin-dts';
// import replace from '@rollup/plugin-replace';

const packageJson = require('./package.json');

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: false,
        plugins: [terser()]
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: false,
        plugins: [terser()]
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ 
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist/types',
        rootDir: 'src',
      }),
      postcss({
        extract: 'style/index.css', // 指定 CSS 输出路径
        modules: false, // 如果你使用 CSS 模块，可以设置为 true
        minimize: true, // 压缩 CSS
        extensions: ['.css', '.scss'], // 处理的文件扩展名
        use: ['sass'], // 使用 SASS 编译器
      }),
      url(),
      // replace({
      //   'import "../../style/index.scss"': 'import "../../dist/style.css"',
      //   preventAssignment: true,
      // }),
    ],
    external: ['react', 'react-dom']
  },
  {
    input: 'dist/types/index.d.ts',
    output: [
      { file: 'dist/types/index.d.ts', format: 'esm' },
      { file: 'dist/types/index.cjs.d.ts', format: 'cjs' }
    ],
    plugins: [dts()],
  },
];