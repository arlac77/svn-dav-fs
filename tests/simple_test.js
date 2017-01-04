/* global describe, it, xit */
/* jslint node: true, esnext: true */

'use strict';

const chai = require('chai'),
  expect = chai.expect,
  assert = chai.assert,
  should = chai.should(),
  SVNHTTPSScheme = require('../dist/svn').SVNHTTPSScheme;

chai.use(require('chai-datetime'));

const credentials = {
  password: 'xxx',
  user: 'yyy'
};

if (process.env.SVN_USER) {
  credentials.user = process.env.SVN_USER;
}

if (process.env.SVN_PASSWORD) {
  credentials.password = process.env.SVN_PASSWORD;
}

describe('svn', () => {

  const svn = new SVNHTTPSScheme({
    proxy: process.env.HTTP_PROXY,
    credentials: credentials
  });

  it('has type', () => assert.equal(svn.type, 'svn+https'));

  /*
    const init = svn.initialize();

    if (process.env.SVN_USER) {
      it('has davFeatures', () =>
        init.then(svn => {
          assert.equal(svn.davFeatures.has('1'), true);
          assert.equal(svn.davFeatures.has('2'), true);
          assert.equal(svn.davFeatures.has('baseline'), true);
          assert.equal(svn.davFeatures.has('version-control'), true);
          assert.equal(svn.davFeatures.has('checkout'), true);
          assert.equal(svn.davFeatures.has('working-resource'), true);
          assert.equal(svn.davFeatures.has('merge'), true);
          assert.equal(svn.davFeatures.has('version-controlled-collection'), true);
          assert.equal(svn.davFeatures.has('http://subversion.tigris.org/xmlns/dav/svn/mergeinfo'), true);
        })
      );

      it('has allowedMethods', () =>
        init.then(svn => {
          assert.equal(svn.allowedMethods.has('GET'), true);
          assert.equal(svn.allowedMethods.has('OPTIONS'), true);
        })
      );
    }
  */

  if (process.env.SVN_USER) {
    it('put', () =>
      svn.put('https://subversion.assembla.com/svn/delivery_notes/', undefined, {
        message: 'this is the message'
      })
    );

    it('history', () =>
      svn.history('https://subversion.assembla.com/svn/delivery_notes/', {
        version: 0,
        chunkSize: 10
      }).then(cursor => {
        let i = 0;

        for (const e of cursor()) {
          e.then(entry => {
            console.log(entry);
            if (i === 0) {
              assert.equal(entry.version, 0);
              assert.afterDate(entry.date, new Date(2011, 1, 1));
              assert.beforeDate(entry.date, new Date(2015, 1, 1));
              assert.include(entry.message, 'Automatically created readme.textile');
            }
            i++;
          });
        }
      }).catch(console.log));

    it('list', () =>
      svn.list('https://subversion.assembla.com/svn/delivery_notes/data').then(
        cursor => {
          let i = 0;

          const entries = [{
            name: 'releases.json'
          }, {
            name: 'servers'
          }, {
            name: 'comp1'
          }, {
            name: 'config.json'
          }, {
            name: 'releases'
          }, {
            name: 'environments.json'
          }];
          for (const e of cursor()) {
            e.then(entry => {
              if (entries[i]) {
                assert.equal(entry.name, entries[i].name);
              }
              console.log(`${i} ${JSON.stringify(entry)}`);
              i++;
            });
          }
        }));
  }
});
