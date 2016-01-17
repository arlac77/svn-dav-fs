/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

import fetch from 'isomorphic-fetch';

const btoa = require('btoa');

const XML_HEADER = '<?xml version="1.0" encoding="utf-8"?>';
const XML_CONTENT_TYPE = 'text/xml';

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
    get davHeader() {
      return [NS_SVN_DAV_DEPTH, NS_SVN_DAV_MERGINFO, NS_SVN_DAV_LOG_REVPROPS].join(',');
    },
    propfind(url, properties, depth = 1) {
      const xmls = [XML_HEADER, '<D:propfind xmlns:D="DAV:">'];

      if (properties) {
        for (let p in properties) {
          xmls.push(`<D:prop><${p} xmlns=\"${properties[p]}\"/></D:prop>`);
        }
      } else {
        xmls.push('<D:allprop/>');
      }

      xmls.push('</D:propfind>');

      return fetch(url, {
        method: 'PROPFIND',
        body: xmls.join('\n'),
        headers: {
          "authorization": this.basicAuthorization,
          "dav": this.davHeader,
          "depth": depth,
          "content-type": XML_CONTENT_TYPE
        }
      });
    },
    report(url, start, end) {
      if (end - start > 1000) start = end - 1000;

      const xmls = [XML_HEADER, '<S:log-report xmlns:S="svn:">'];
      xmls.push(`<S:start-revision>${start}</S:start-revision>`);
      xmls.push(`<S:end-revision>${end}</S:end-revision>`);
      ['svn:author', 'svn:date', 'svn:log'].forEach(item => {
        xmls.push(`<S:revprop>${item}</S:revprop>`);
      });

      xmls.push('<S:path/>');
      xmls.push('</S:log-report>');

      return fetch(url, {
        method: 'REPORT',
        body: xmls.join('\n'),
        headers: {
          "authorization": this.basicAuthorization,
          "dav": this.davHeader,
          "content-type": XML_CONTENT_TYPE
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
  const davFeatures = new Set();
  const allowedMethods = new Set();

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
    allowedMethods: {
      get() {
        return allowedMethods;
      }
    }
  });

  /*
  OPTIONS /svn/delivery_notes/data HTTP/1.1
  Host: subversion.assembla.com
  Authorization: Basic XXX
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

  return fetch(url, {
    method: 'OPTIONS',
    body: [XML_HEADER, '<D:options xmlns:D="DAV:">', '<D:activity-collection-set></D:activity-collection-set>',
      '</D:options>'
    ].join(''),
    headers: {
      "authorization": svn.basicAuthorization,
      "dav": svn.davHeader,
      //'user-agent': 'SVN/1.9.2 (x86_64-apple-darwin15.0.0) serf/1.3.8',
      //'connection': "keep-alive",
      "content-type": XML_CONTENT_TYPE
    }
  }).then(response => {
    const headers = response.headers._headers;

    //console.log(`Headers ${JSON.stringify(headers)}`);
    //console.log(`RAW headers: ${JSON.stringify(headers.raw)}`);

    SVNHeaders.forEach(h => {
      if (headers[h]) {
        attributes[h] = headers[h];
        console.log(`${h}: ${headers[h]}`);
      }
    });

    headerIntoSet(headers.dav, davFeatures);
    headerIntoSet(headers.allow, allowedMethods);

    attributes['SVN-Youngest-Rev'] = parseInt(headers['SVN-Youngest-Rev'], 10);

    //console.log(`rev: ${headers['SVN-Youngest-Rev']}`);
    //console.log(`Attributes: ${JSON.stringify(attributes)}`);
    return svn;
  });
}

function headerIntoSet(header, target) {
  if (header) {
    header.forEach(h => h.split(/\s*,\s*/).forEach(e => target.add(e)));
  }
}
