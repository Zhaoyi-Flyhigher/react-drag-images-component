import {defineBuildConfig} from 'unbuild'

export default defineBuildConfig({
    entries: ["./src/main"],
    rollup: {
        cjsBridge: true,
        emitCJS: true,
    },
    clean: true,
    declaration: true,
    sourcemap: true,
});