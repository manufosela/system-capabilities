import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/system-capabilities-lit.umd.js',
      format: 'umd',
      name: 'SystemCapabilitiesLit',
      sourcemap: true,
      globals: {}
    },
    {
      file: 'dist/system-capabilities-lit.umd.min.js',
      format: 'umd',
      name: 'SystemCapabilitiesLit',
      sourcemap: true,
      plugins: [terser()],
      globals: {}
    }
  ],
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false
    })
  ]
};
