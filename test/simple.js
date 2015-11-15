/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

const svn = require('../lib/svn');

describe('t1', function () {
  assert.equal(svn.init(), 1);
});
