import babel from 'rollup-plugin-babel';
import multiEntry from 'rollup-plugin-multi-entry';

export default {
  entry: 'tests/**/*-test.js',
  external: ['ava', 'url-resolver-fs'],
  plugins: [
    babel({
      babelrc: false,
      presets: ['stage-3'],
      exclude: 'node_modules/**'
    }),
    multiEntry()
  ],
  format: 'cjs',
  dest: 'build/test-bundle.js',
  sourceMap: true
};
