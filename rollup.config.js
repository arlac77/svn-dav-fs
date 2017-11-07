import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default {
  plugins: [
    babel({
      babelrc: false,
      presets: ['stage-3'],
      exclude: 'node_modules/**'
    })
  ],

  output: {
    file: pkg.main,
    format: 'cjs'
  },

  external: ['url-resolver-fs'],
  input: pkg.module
};
