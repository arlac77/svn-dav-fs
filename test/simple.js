/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai'),
  expect = chai.expect,
  should = chai.should();

import assert from 'assert';
import {
  init
}
from '../lib/svn';


describe('initialize', function () {
  it('has toString', function (done) {
    init('https://subversion.assembla.com/svn/delivery_notes', {
      credentials: {
        password: 'xxx',
        user: 'yyy'
      }
    }).then(function (svn) {
      assert.equal(`${svn}`, "svn");
      done();
    }, done);
  });

  it('has basicAuthorization', function (done) {
    init('https://subversion.assembla.com/svn/delivery_notes', {
      credentials: {
        password: 'xxx',
        user: 'yyy'
      }
    }).then(function (svn) {
      try {
        assert.equal(svn.basicAuthorization, "Basic eXl5Onh4eA==");
        done();
      }
      catch(e) {
        done(e);
      }
    }, done);
  });
});
