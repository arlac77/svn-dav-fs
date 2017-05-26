/* jslint node: true, esnext: true */

import babel from 'rollup-plugin-babel';
import multiEntry from 'rollup-plugin-multi-entry';

export default {
  entry: 'tests/**/*_test.js',
  external: ['ava', 'url-resolver-fs'],
  plugins: [
    babel({
      babelrc: false,
      presets: ['es2017', 'stage-3'],
      exclude: 'node_modules/**'
    }),
    multiEntry()
  ],
  format: 'cjs',
  dest: 'tests/build/bundle.js',
  sourceMap: true
};
