/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

/*
const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();
*/

import assert from 'assert';
import {
  init
}
from '../lib/svn';

describe('initialize', function () {
  it('has toString', function () {
    assert.equal(`${init()}`, "svn");
  });
});
