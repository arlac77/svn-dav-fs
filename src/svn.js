//import fetch from 'node-fetch';

import fetch from 'isomorphic-fetch';

const btoa = require('btoa');

const NS_S = 'svn:';
const NS_D = 'DAV:';

const NS_SVN_DAV = "http://subversion.tigris.org/xmlns/dav/";
const NS_SVN_DAV_DEPTH = NS_SVN_DAV + "svn/depth";
const NS_SVN_DAV_MERGINFO = NS_SVN_DAV + "svn/mergeinfo";
const NS_SVN_DAV_LOG_REVPROPS = NS_SVN_DAV + "svn/log-revprops";
const NS_SVN_DAV_ATOMIC_REVPROPS = NS_SVN_DAV + "svn/atomic-revprops";
const NS_SVN_DAV_PARTIAL_REPLAY = NS_SVN_DAV + "svn/partial-replay";

const DAVFeatures = {
  '1': {},
  '2': {},
  'version-control': {},
  'checkout': {},
  'working-resource': {},
  'merge': {},
  'baseline': {},
  'activity': {},
  'version-controlled-collection': {},
  'http://subversion.tigris.org/xmlns/dav/svn/inherited-props': {},
  'http://subversion.tigris.org/xmlns/dav/svn/inline-props': {},
  'http://subversion.tigris.org/xmlns/dav/svn/reverse-file-revs': {},
  'http://subversion.tigris.org/xmlns/dav/svn/ephemeral-txnprops': {},
  'http://subversion.tigris.org/xmlns/dav/svn/replay-rev-resource': {},
  [NS_SVN_DAV_MERGINFO]: {},
  [NS_SVN_DAV_PARTIAL_REPLAY]: {},
  [NS_SVN_DAV_DEPTH]: {},
  [NS_SVN_DAV_LOG_REVPROPS]: {},
  [NS_SVN_DAV_ATOMIC_REVPROPS]: {}
};

const SVNHeaders = [
  'SVN-Repository-UUID',
  'SVN-Repository-Root',
  'SVN-Rev-Root-Stub', // /svn/delivery_notes/!svn/rvr
  'SVN-Rev-Stub', // /svn/delivery_notes/!svn/rev
  'SVN-Txn-Root-Stub', // /svn/delivery_notes/!svn/vtxr
  'SVN-Txn-Stub', // /svn/delivery_notes/!svn/txn

  'SVN-Me-Resource', // /svn/delivery_notes/!svn/me
  'SVN-Rev-Root-Stub', // /svn/delivery_notes/!svn/rvr

  'SVN-Youngest-Rev', // Integer
  'SVN-Allow-Bulk-Updates', // Prefer
  'SVN-Supported-Posts', // create-txn create-txn-with-props
  'SVN-Repository-MergeInfo' // yes
];

const SVN = {
  toString() {
      return "svn";
    },
    get basicAuthorization() {
      return 'Basic ' + btoa(this.credentials.user + ':' + this.credentials.password);
    },
    get vccDefault() {
      return [this.attributes['SVN-Repository-Root'], "!svn/vcc/default"].join('/');
    },
    davHeader() {
      return [NS_SVN_DAV_DEPTH, NS_SVN_DAV_MERGINFO, NS_SVN_DAV_LOG_REVPROPS].join(',');
    },
    propfind(url, properties, depth = 1) {
      var xml = '<?xml version="1.0" encoding="UTF-8" ?>\n';
      xml += '<D:propfind xmlns:D="DAV:">\n';

      if (properties) {
        for (var p in properties) {
          xml += '<D:prop><' + p + ' xmlns=\"' + properties[p] + '\"/></D:prop>';
        }
      } else {
        xml += '<D:allprop/>\n';
      }

      xml += '</D:propfind>\n';

      return fetch(url, {
        method: 'PROPFIND',
        body: xml,
        headers: {
          "Authorization": svn.basicAuthorization,
          "DAV": this.davHeader(),
          "Depth": depth,
          "Content-type": "text/xml; charset=UTF-8"
        }
      });
    },
    report(url, start, end) {
      if (end - start > 1000) start = end - 1000;

      var xml = '<?xml version="1.0" encoding="UTF-8" ?>\n';
      xml += '<S:log-report xmlns:S="svn:">\n';
      xml += '<S:start-revision>' + start + '</S:start-revision>\n';
      xml += '<S:end-revision>' + end + '</S:end-revision>\n';

      const properties = ['svn:author', 'svn:date', 'svn:log'];
      properties.forEach((item) => {
        xml += '<S:revprop>' + item + '</S:revprop>';
      });
      xml += '<S:path/>\n';
      xml += '</S:log-report>\n';

      return fetch(url, {
        method: 'REPORT',
        body: xml,
        headers: {
          "Authorization": svn.basicAuthorization,
          "DAV": this.davHeader(),
          "Content-type": "text/xml; charset=UTF-8"
        }
      });
    }
};

/*
OPTIONS /svn/delivery_notes HTTP/1.1
Host: subversion.assembla.com
Authorization: Basic YXJsYWM3NzpzdGFydDEyMw==
User-Agent: SVN/1.9.2 (x86_64-apple-darwin15.0.0) serf/1.3.8
Content-Type: text/xml
Connection: keep-alive
Accept-Encoding: gzip
DAV: http://subversion.tigris.org/xmlns/dav/svn/depth
DAV: http://subversion.tigris.org/xmlns/dav/svn/mergeinfo
DAV: http://subversion.tigris.org/xmlns/dav/svn/log-revprops
Content-Length: 131

<?xml version="1.0" encoding="utf-8"?><D:options xmlns:D="DAV:"><D:activity-collection-set></D:activity-collection-set></D:options>
*/

export function init(url, options) {

  const attributes = {};
  let davFeatures = new Set();

  const svn = Object.create(SVN, {
    credentials: {
      get() {
        return options.credentials;
      }
    },
    attributes: {
      get() {
        return attributes;
      }
    },
    davFeatures: {
      get() {
        return davFeatures;
      }
    },
  });

  return fetch(url, {
    method: 'OPTIONS',
    body: '<?xml version="1.0" encoding="utf-8"?><D:options xmlns:D="DAV:"><D:activity-collection-set></D:activity-collection-set></D:options>',
    headers: {
      "Authorization": svn.basicAuthorization,
      "DAV": svn.davHeader(),
      "Content-type": "text/xml"
    }
  }).then(function (response) {
    const headers = response.headers._headers;

    console.log(`${JSON.stringify(headers)}`);
    //console.log(`RAW headers: ${JSON.stringify(headers.raw)}`);

    SVNHeaders.forEach(h => {
      if (headers[h]) {
        attributes[h] = headers[h];
        console.log(`${h}: ${headers[h]}`);
      }
    });

    const dav = headers.dav;
    if (dav) {
      dav.forEach(al => al.split(/\s*,\s*/).forEach(f => davFeatures.add(f)));
    }

    attributes['SVN-Youngest-Rev'] = parseInt(headers['SVN-Youngest-Rev'], 10);

    //console.log(`rev: ${headers['SVN-Youngest-Rev']}`);
    //console.log(`Attributes: ${JSON.stringify(attributes)}`);
    return svn;
  });
}
