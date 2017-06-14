import test from 'ava';
import {
  encodeProperties
}
from '../src/util';

test('encodeProperties', t => {
  const value = {
    'create-txn-with-props': {
      'svn:txn-user-agent': 'SVN/1.9.4 (x86_64-apple-darwin15.0.0) serf/1.3.8',
      'svn:log': 'this is the message',
      'svn:txn-client-compat-version': '1.9.4'
    }
  };

  t.is(encodeProperties(value),
    '(create-txn-with-props (svn:txn-user-agent 48 SVN/1.9.4 (x86_64-apple-darwin15.0.0) serf/1.3.8 svn:log 19 this is the message svn:txn-client-compat-version 5 1.9.4))'
  );
});
