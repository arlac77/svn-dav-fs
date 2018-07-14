import test from 'ava';
import { SVNHTTPSScheme } from '../src/svn';
import { URL } from 'url';

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

const OPTIONS = {
  proxy: process.env.HTTP_PROXY,
  provideCredentials: async realm => {
    //console.log(realm);
    return credentials;
  }
};

test('start transaction', async t => {
  const context = undefined;
  const svn = new SVNHTTPSScheme(OPTIONS);

  const { txn, acs } = await svn.startTransaction(
    context,
    new URL(
      'https://subversion.assembla.com/svn/delivery_notes/data/environments.json'
    ),
    'a new transaction'
  );

  //console.log(txn);

  t.is(txn.length > 4, true);
});

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

/*
  if (process.env.SVN_USER) {
    describe('activityCollectionSet', () => {

      xit('attributes', () => svn.activityCollectionSet('https://subversion.assembla.com/svn/delivery_notes/')
        .then(({
          attributes
        }) => assert.deepEqual(attributes, {
          'SVN-Youngest-Rev': 17
        })));
    });

    xit('put', () =>
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
            //console.log(entry);
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
  }
*/
