/* jslint node: true, esnext: true */

import babel from 'rollup-plugin-babel';
import multiEntry from 'rollup-plugin-multi-entry';

export default {
  entry: 'tests/**/*_test.js',
  external: ['ava', 'url-resolver-fs'],
  plugins: [
    babel({
      babelrc: false,
      plugins: [
        'transform-async-generator-functions'
      ],
      //presets: ['es2015-rollup'],
      exclude: 'node_modules/**'
    }),
    multiEntry()
  ],
  format: 'cjs',
  dest: 'tests/build/bundle.js',
  sourceMap: true
};
