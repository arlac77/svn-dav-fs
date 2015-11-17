import fetch from 'node-fetch';

const NS_S = 'svn:';
const NS_D = 'DAV:';
const NS_SVNDAV = 'http://subversion.tigris.org/xmlns/dav/';
const NS_SVNDAV_DEPTH = 'http://subversion.tigris.org/xmlns/dav/svn/depth';
const NS_SVNDAV_MERGINFO = 'http://subversion.tigris.org/xmlns/dav/svn/mergeinfo';
const NS_SVNDAV_LOG_REVPROPS = 'http://subversion.tigris.org/xmlns/dav/svn/log-revprops';
const NS_SVNDAV_ATOMIC_REVPROPS = 'http://subversion.tigris.org/xmlns/dav/svn/atomic-revprops';
const NS_SVNDAV_PARTIAL_REPLAY = 'http://subversion.tigris.org/xmlns/dav/svn/partial-replay';

const SVN = {
  toString() {
    return "svn";
  }
};

export function init(url) {

  const svn = Object.create(SVN);

  return fetch(url, {
    method: 'OPTIONS',
    body: '<?xml version="1.0" encoding="utf-8"?><D:options xmlns:D="DAV:"><D:activity-collection-set/></D:options>\n',
    headers: {
      //  "Authorization": 'Basic ' + window.btoa(svn.credentials.user + ':' + svn.credentials.password),
      "DAV": [NS_SVNDAV_DEPTH, NS_SVNDAV_MERGINFO, NS_SVNDAV_LOG_REVPROPS].join(','),
      "Content-type": "text/xml; charset=UTF-8"
    }
  }).then(function (response) {
    var headers = {
      'SVN-Repository-UUID': 'uuid',
      'SVN-Repository-Root': 'root',
      'SVN-Rev-Root-Stub': 'revisionRootStub',
      'SVN-Rev-Stub': 'revisionStub',
      'SVN-Txn-Root-Stub': 'transactionRootStub',
      'SVN-Txn-Stub': 'transactionStub',
      'SVN-Me-Resource': 'meResource'
    };

    for (var i in headers) {
      var h = headers[i];
      svn[h] = response.headers.get(i);
      console.log(`${h}: ${svn[h]}`);
    }

    svn.youngestRevision = parseInt(response.headers.get('SVN-Youngest-Rev'), 10);

    svn.vccDefault = svn.root + "/" + "!svn/vcc/default";
    return svn;
  });
}
