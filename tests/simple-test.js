import test from 'ava';
import { SVNHTTPSScheme } from '../src/svn';

const { URL } = require('url');

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

test('has type', t => {
  const svn = new SVNHTTPSScheme();
  t.is(svn.type, 'svn+https');
});

test('can stat', async t => {
  const context = undefined;
  const svn = new SVNHTTPSScheme({
    proxy: process.env.HTTP_PROXY,
    credentials
  });

  const stat = await svn.stat(
    context,
    new URL(
      'https://subversion.assembla.com/svn/delivery_notes/data/environments.json'
    )
  );

  t.deepEqual(stat, {
    creationDate: new Date('2016-01-30T13:36:16.649803Z'),
    size: 114,
    creator: 'arlac77',
    version: 1481
  });
});

test('can list', async t => {
  const context = undefined;
  const svn = new SVNHTTPSScheme({
    proxy: process.env.HTTP_PROXY,
    credentials
  });

  const entries = await svn.list(
    context,
    new URL('https://subversion.assembla.com/svn/delivery_notes/data')
  );
  const all = new Set();

  entries.forEach(entry => all.add(entry.name));

  t.true(all.has('releases.json'));
  t.true(all.has('comp1'));
  t.true(all.has('releases'));
  t.true(all.has('servers'));
  t.true(all.has('config.json'));
  t.true(all.has('environments.json'));
});
