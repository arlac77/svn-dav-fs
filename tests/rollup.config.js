import istanbul from "rollup-plugin-istanbul";
import babel from "rollup-plugin-babel";
import multiEntry from "rollup-plugin-multi-entry";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "tests/**/*-test.js",
  external: ["ava", "url", "url-resolver-fs"],

  plugins: [
    multiEntry(),
    resolve(),
    commonjs(),
    babel({
      runtimeHelpers: false,
      externalHelpers: true,
      babelrc: false,
      plugins: ["@babel/plugin-proposal-async-generator-functions"]
    }),
    istanbul({
      exclude: ["tests/**/*-test.js", "node_modules/**/*"]
    })
  ],

  output: {
    file: "build/bundle-test.js",
    format: "cjs",
    sourcemap: true,
    interop: false
  }
};
