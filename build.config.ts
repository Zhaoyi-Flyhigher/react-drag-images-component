import {defineBuildConfig} from 'unbuild';
// import typescript from '@rollup/plugin-typescript';
// import sass from 'rollup-plugin-sass';

export default defineBuildConfig({
    entries: [
        {
            input: "src/component",
            outDir: 'dist/component', 
            builder: "mkdist",
            declaration: false,
        },
        {
            input: "src/style",
            outDir: 'dist/style', 
            builder: "mkdist",
            declaration: false,
        },
        {
            input: "src/types",
            outDir: 'dist/types', 
            builder: "mkdist",
            declaration: false,
        },
        {
            input: "src/utils",
            outDir: "dist/utils",
            builder: "mkdist",
            declaration: false,
        },
        {
            input: "src/assets",
            outDir: "dist/assets",
            builder: "mkdist",
            declaration: false,
        },
    ],
    // dts: {
    //     outDir: "dist/types"
    // },
    rollup: {
        cjsBridge: true,
        emitCJS: true,
        // plugins: [
        //     typescript({
        //         tsconfig: './tsconfig.json'
        //     }),
        //     sass({
        //       output: './dist/style/index.css' //输出到指定的 CSS 文件
        //     }),
        // ],
    },
    clean: true,
    declaration: true,
    sourcemap: false,
});