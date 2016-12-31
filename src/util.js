/* jslint node: true, esnext: true */

'use strict';

/*
(create-txn-with-props (svn:txn-user-agent 48 SVN/1.9.4 (x86_64-apple-darwin15.0.0) serf/1.3.8 svn:log 19 this is the message svn:txn-client-compat-version 5 1.9.4))
*/
function encodeProperties(object) {
  /*
  if (typeof object === 'string' || object instanceof String) {
    return object;
  }*/

  return '(' + Object.keys(object).map(k => {
    const v = object[k];

    if (typeof v === 'string' || v instanceof String) {
      return `${k} ${v.length} ${v}`;
    }

    return `${k} ${encodeProperties(v)}`;
  }).join(' ') + ')';
}

function headerIntoSet(header, target) {
  if (header) {
    header.forEach(h => h.split(/\s*,\s*/).forEach(e => target.add(e)));
  }
}


export {
  headerIntoSet,
  encodeProperties
};
