import {defineBuildConfig} from 'unbuild';

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
    rollup: {
        cjsBridge: true,
        emitCJS: true,
    },
    clean: true,
    declaration: true,
    sourcemap: false,
});