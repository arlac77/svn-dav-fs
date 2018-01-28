import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  plugins: [resolve(), commonjs()],

  output: {
    file: pkg.main,
    format: 'cjs'
  },

  external: ['url', 'url-resolver-fs'],
  input: pkg.module
};
