import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/system-capabilities.js',
    format: 'umd',
    name: 'SystemCapabilities',
    exports: 'default'
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs()
  ]
};
