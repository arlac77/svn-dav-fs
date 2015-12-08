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

if (process.env.SVN_USER) {
  credentials.user = process.env.SVN_USER;
}

if (process.env.SVN_PASSWORD) {
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

  if (process.env.SVN_USER) {
    it('has davFeatures', function (done) {
      init('https://subversion.assembla.com/svn/delivery_notes/', {
        credentials: credentials
      }).then(function (svn) {
        console.log(`DAV: ${[...svn.davFeatures]}`);
        assert.equal(svn.davFeatures.has('1'), true);
        assert.equal(svn.davFeatures.has('2'), true);
        assert.equal(svn.davFeatures.has('baseline'), true);
        assert.equal(svn.davFeatures.has('version-control'), true);
        assert.equal(svn.davFeatures.has('checkout'), true);
        assert.equal(svn.davFeatures.has('working-resource'), true);
        assert.equal(svn.davFeatures.has('merge'), true);
        assert.equal(svn.davFeatures.has('version-controlled-collection'), true);
        assert.equal(svn.davFeatures.has('http://subversion.tigris.org/xmlns/dav/svn/mergeinfo'), true);
        done();
      }, done);
    });
  }

  it('has basicAuthorization', function (done) {
    init('https://subversion.assembla.com/svn/delivery_notes/', {
      credentials: credentials
    }).then(function (svn) {
      try {
        if (process.env.SVN_USER) {
          assert.equal(svn.basicAuthorization.substring(0, 6), "Basic ");
        } else {
          assert.equal(svn.basicAuthorization, "Basic eXl5Onh4eA==");
        }
        done();
      } catch (e) {
        done(e);
      }
    }, done);
  });
});
