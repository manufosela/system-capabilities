import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const sharedPlugins = [
  resolve({
    browser: true
  }),
  commonjs()
];

export default [
  // ESM moderno (para apps con bundlers modernos)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/system-capabilities.mjs',
      format: 'es',
      exports: 'default'
    },
    plugins: sharedPlugins
  },
  // CommonJS (para Node.js y compatibilidad)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/system-capabilities.cjs',
      format: 'cjs',
      exports: 'default'
    },
    plugins: sharedPlugins
  },
  // UMD (para uso directo en navegador con <script>)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/system-capabilities.umd.js',
      format: 'umd',
      name: 'SystemCapabilities',
      exports: 'default'
    },
    plugins: sharedPlugins
  }
];
