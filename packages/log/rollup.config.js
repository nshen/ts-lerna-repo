import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.ts'];

export default [{
    input: './src/index.ts',
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
        resolve({ extensions }),
        babel({ extensions, include: ['./src/**/*'] }),
    ],
    output: [
        // { file: pkg.browser, format: 'iife', name: 'window', extend: true, globals: {} },
        // { file: pkg.browserMin, format: 'iife', name: 'window', extend: true, globals: {}, plugins: [terser()] },
        { file: pkg.module, format: 'es' },
        // { file: pkg.moduleMin, format: 'es', plugins: [terser()] },
        // { file: pkg.unpkg, format: 'umd', name: 'app' },
    ],
    watch: {
        chokidar: {
            usePolling: true
        }
    }
}];