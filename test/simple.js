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

var credentials = {
  password: 'xxx',
  user: 'yyy'
};

if(process.env.SVN_USER) {
  credentials.user = process.env.SVN_USER;
}

if(process.env.SVN_PASSWORD) {
  credentials.password = process.env.SVN_PASSWORD;
}

describe('initialize', function () {
  it('has toString', function (done) {
    init('https://subversion.assembla.com/svn/delivery_notes', {
      credentials: credentials
    }).then(function (svn) {
      assert.equal(`${svn}`, "svn");
      done();
    }, done);
  });

  it('has basicAuthorization', function (done) {
    init('https://subversion.assembla.com/svn/delivery_notes', {
      credentials: credentials
    }).then(function (svn) {
      try {
        if(process.env.SVN_USER) {
          assert.equal(svn.basicAuthorization.substring(0,6), "Basic ");
        }
        else {
          assert.equal(svn.basicAuthorization, "Basic eXl5Onh4eA==");
        }
        done();
      }
      catch(e) {
        done(e);
      }
    }, done);
  });
});
