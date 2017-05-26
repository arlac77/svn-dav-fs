/* jslint node: true, esnext: true */
'use strict';

import babel from 'rollup-plugin-babel';

export default {
  format: 'cjs',
  plugins: [
    babel({
      babelrc: false,
      presets: ['stage-3', 'es2017'],
      exclude: 'node_modules/**'
    })
  ],
  external: ['url-resolver-fs']
};
