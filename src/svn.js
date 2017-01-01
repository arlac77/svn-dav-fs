/* jslint node: true, esnext: true */

'use strict';

const sax = require('sax');

import {
  HTTPScheme
}
from 'uri-resolver';

import {
  headerIntoSet,
  encodeProperties
}
from './util';

const XML_HEADER = '<?xml version="1.0" encoding="utf-8"?>';
const XML_CONTENT_TYPE = 'text/xml';
const SVN_SKEL_CONTENT_TYPE = 'application/vnd.svn-skel';
const SVN_SVNDIFF_CONTENT_TYPE = 'application/vnd.svn-svndiff';

const NS_SVN_DAV = 'http://subversion.tigris.org/xmlns/dav/';
const NS_SVN_DAV_DEPTH = NS_SVN_DAV + 'svn/depth';
const NS_SVN_DAV_MERGINFO = NS_SVN_DAV + 'svn/mergeinfo';
const NS_SVN_DAV_LOG_REVPROPS = NS_SVN_DAV + 'svn/log-revprops';

/*
const NS_SVN_DAV_ATOMIC_REVPROPS = NS_SVN_DAV + 'svn/atomic-revprops';
const NS_SVN_DAV_PARTIAL_REPLAY = NS_SVN_DAV + 'svn/partial-replay';

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
*/

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

function ignore() {}

/**
 * URL sheme 'svn+https' svn over https
 */
class SVNHTTPSScheme extends HTTPScheme {
  initialize() {
    return this.activityCollectionSet(this.url).then(acs => {
      const {
        attributes, davFeatures, allowedMethods
      } = acs;

      Object.defineProperties(this, {
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

      return this;
    });
  }

  options(url, body) {
    return this._fetch(this.url, {
      method: 'OPTIONS',
      body: [XML_HEADER, ...body].join(''),
      headers: {
        dav: this.davHeader,
        'content-type': XML_CONTENT_TYPE
      }
    });
  }

  activityCollectionSet(url) {
    return this.options(this.url, ['<D:options xmlns:D="DAV:">',
      '<D:activity-collection-set></D:activity-collection-set>',
      '</D:options>'
    ]).then(response => {
      const headers = response.headers._headers ? response.headers._headers : response.headers.map;

      const attributes = {};
      const davFeatures = new Set();
      const allowedMethods = new Set();

      if (headers) {
        SVNHeaders.forEach(h => {
          if (headers[h]) {
            attributes[h] = headers[h];
            console.log(`${h}: ${headers[h]}`);
          }
        });

        headerIntoSet(headers.dav, davFeatures);
        headerIntoSet(headers.allow, allowedMethods);

        attributes['svn-youngest-rev'] = parseInt(headers['svn-youngest-rev'], 10);

        return {
          attributes, davFeatures, allowedMethods
        };
      }
    });
  }

  // TODO why is this not taken from the base class ?
  get type() {
    return 'svn+https';
  }

  static get name() {
    return 'svn+https';
  }

  /**
   * Delivers svn user agent 
   * @return {String} user agent identifier
   */
  get userAgent() {
    return 'SVN/1.9.4 (x86_64-apple-darwin15.0.0) serf/1.3.8';
  }

  /**
   * Delivers svn clinet version
   * @return {String} version
   */
  get clientVersion() {
    return '1.9.4';
  }
 
  get vccDefault() {
    return [this.attributes['SVN-Repository-Root'], '!svn/vcc/default'].join('/');
  }

  get davHeader() {
    return [NS_SVN_DAV_DEPTH, NS_SVN_DAV_MERGINFO, NS_SVN_DAV_LOG_REVPROPS].join(',');
  }

  put(url, stream, options) {
    /*this.activityCollectionSet(url).then(acs => {
    }).then(() =>
      this.options(url, ['<D:options xmlns:D="DAV:"/>'])
    );*/

    return this._fetch('https://subversion.assembla.com/svn/delivery_notes/' + '!svn/me', {
      method: 'POST',
      body: encodeProperties({
        'create-txn-with-props': {
          'svn:txn-user-agent': this.userAgent,
          'svn:log': options.message,
          'svn:txn-client-compat-version': this.clientVersion
        }
      }),
      headers: {
        dav: this.davHeader,
        'content-type': SVN_SKEL_CONTENT_TYPE
      }
    }).then(response => {
      const headers = response.headers._headers ? response.headers._headers : response.headers.map;
      console.log(response);
      const txn = headers['SVN-Txn-Name'];
      console.log(`txn: ${txn}`);
    });

    /*
    POST /svn/delivery_notes/!svn/me HTTP/1.1
    Content-Type	application/vnd.svn-skel
    DAV	http://subversion.tigris.org/xmlns/dav/svn/depth
    DAV	http://subversion.tigris.org/xmlns/dav/svn/mergeinfo
    DAV	http://subversion.tigris.org/xmlns/dav/svn/log-revprops

    (create-txn-with-props (svn:txn-user-agent 48 SVN/1.9.4 (x86_64-apple-darwin15.0.0) serf/1.3.8 svn:log 19 this is the message svn:txn-client-compat-version 5 1.9.4))

    Response:
    SVN-Txn-Name: 1483-1a1
    */


    /*
    PUT /svn/delivery_notes/!svn/txr/1483-1a1/data/config.json HTTP/1.1
    Content-Type: application/vnd.svn-svndiff
    DAV: http://subversion.tigris.org/xmlns/dav/svn/depth
    DAV: http://subversion.tigris.org/xmlns/dav/svn/mergeinfo
    DAV: http://subversion.tigris.org/xmlns/dav/svn/log-revprops
    X-SVN-Version-Name: 1483
    X-SVN-Base-Fulltext-MD5: 7f407419826ad120a3c9374947770470
    X-SVN-Result-Fulltext-MD5: 03d6350bb46a63e86f1c5db703af403c
    */

    /*
    MERGE /svn/delivery_notes/data HTTP/1.1
    Content-Type: text/xml
    DAV: http://subversion.tigris.org/xmlns/dav/svn/depth
    DAV: http://subversion.tigris.org/xmlns/dav/svn/mergeinfo
    DAV: http://subversion.tigris.org/xmlns/dav/svn/log-revprops
    X-SVN-Options: release-locks

    <?xml version="1.0" encoding="utf-8"?>
    <D:merge xmlns:D="DAV:">
      <D:source>
        <D:href>/svn/delivery_notes/!svn/txn/1483-1a1</D:href>
      </D:source>
      <D:no-auto-merge/>
      <D:no-checkout/>
      <D:prop>
        <D:checked-in/>
        <D:version-name/>
        <D:resourcetype/>
        <D:creationdate/>
        <D:creator-displayname/>
      </D:prop>
    </D:merge>

    Reponse:
    HTTP/1.1 200 OK
Content-Type: text/xml

<?xml version="1.0" encoding="utf-8"?>
<D:merge-response xmlns:D="DAV:">
<D:updated-set>
<D:response>
<D:href>/svn/delivery_notes/!svn/vcc/default</D:href>
<D:propstat><D:prop>
<D:resourcetype><D:baseline/></D:resourcetype>

<D:version-name>1484</D:version-name>
<D:creationdate>2016-12-28T20:24:49.296311Z</D:creationdate>
<D:creator-displayname>arlac77</D:creator-displayname>
</D:prop>
<D:status>HTTP/1.1 200 OK</D:status>
</D:propstat>
</D:response>
<D:response>
<D:href>/svn/delivery_notes/data/config.json</D:href>
<D:propstat><D:prop>
<D:resourcetype/>
<D:checked-in><D:href>/svn/delivery_notes/!svn/ver/1484/data/config.json</D:href></D:checked-in>
</D:prop>
<D:status>HTTP/1.1 200 OK</D:status>
</D:propstat>
</D:response>
</D:updated-set>
</D:merge-response>
    */
  }

  list(url, properties) {
    const depth = 1;
    const xmls = [XML_HEADER, '<D:propfind xmlns:D="DAV:">'];

    if (properties === undefined) {
      xmls.push('<D:allprop/>');
    } else {
      for (const p in properties) {
        xmls.push(`<D:prop><${p} xmlns="${properties[p]}"/></D:prop>`);
      }
    }

    xmls.push('</D:propfind>');

    return this._fetch(url, {
      method: 'PROPFIND',
      body: xmls.join('\n'),
      headers: {
        dav: this.davHeader,
        depth: depth,
        'content-type': XML_CONTENT_TYPE
      }
    }).then(response => {
      return new Promise((fullfill, reject) => {
        const entries = [];
        let entry;
        let consume = ignore;
        let rootPathPrefixLength;

        const saxStream = sax.createStream(true, {
          xmlns: true,
          position: false,
          trim: true
        });

        saxStream.on('opentag', node => {
          switch (node.local) {
            case 'response':
              break;
            case 'prop':
              entry = {};
              consume = ignore;
              break;
            case 'collection':
              entry.collection = true;
              break;
            case 'version-name':
              consume = text => {
                entry.version = parseInt(text, 10);
                consume = ignore;
              };
              break;
            case 'creator-displayname':
              consume = text => {
                entry.creator = text;
                consume = ignore;
              };
              break;
            case 'creationdate':
              consume = text => {
                entry.creationDate = new Date(text);
                consume = ignore;
              };
              break;
            case 'baseline-relative-path':
              consume = text => {
                if (rootPathPrefixLength) {
                  entry.name = text.substring(rootPathPrefixLength);
                } else {
                  rootPathPrefixLength = text.length + 1;
                  entry = undefined;
                }
                consume = ignore;
              };
              break;
              /*  case 'resourcetype':
                  consume = text => { 
                    console.log(`resourcetype: ${text}`);
                    //consume = ignore;
                  };
                  break;
                            default:
                              console.log(`${node.name} ${node.local} ${node.uri}`);
                              */
          }
        });

        saxStream.on('closetag', name => {
          switch (name) {
            case 'D:prop':
              if (entry !== undefined) {
                entries.push(entry);
              }
              break;
          }
        });

        saxStream.on('text', text => consume(text));

        saxStream.on('end', () => fullfill(function* () {
          for (const i in entries) {
            yield Promise.resolve(entries[i]);
          }
        }));
        saxStream.on('error', reject);
        response.body.pipe(saxStream);
      });
    });
  }

  history(url, options = {}) {
    const p = options.version === undefined ?
      this.list(url).then(entries => Promise.resolve(entries[0].version)) : Promise.resolve(options.version);

    return p.then(start => {
      const direction = options.direction || options.version === undefined ? 'backward' : 'forward';
      const chunkSize = options.chunkSize || 1000;

      let end = direction === 'forward' ? start + chunkSize : start - chunkSize;
      if (end < 0) {
        end = 0;
      }
      if (start > end) {
        const t = start;
        start = end;
        end = t;
      }
      return this._history(url, start, end).then(
        entries => {
          const self = this;
          return Promise.resolve(function* () {
            for (const i in entries) {
              yield Promise.resolve(entries[i]);
            }
            let i = 0;
            const p = self._history(url, end + 1, end + chunkSize);

            for (let j = 0; j < 10; j++) {
              yield p.then(entries => {
                return Promise.resolve(entries[i++]);
              });
            }

            /*
                          yield p.then(entries => {
                            return Promise.resolve(entries[i++]);
                          });
            */
          });
        }
      );
    });
  }

  _history(url, start, end) {
    const xmls = [XML_HEADER, '<S:log-report xmlns:S="svn:">'];
    xmls.push(`<S:start-revision>${start}</S:start-revision>`);
    xmls.push(`<S:end-revision>${end}</S:end-revision>`);
    ['svn:author', 'svn:date', 'svn:log'].forEach(item => xmls.push(`<S:revprop>${item}</S:revprop>`));

    xmls.push('<S:path/>');
    xmls.push('</S:log-report>');

    return this._fetch(url, {
      method: 'REPORT',
      body: xmls.join('\n'),
      headers: {
        'dav': this.davHeader,
        'content-type': XML_CONTENT_TYPE
      }
    }).then(response =>
      new Promise((fullfill, reject) => {
        /*
        <S:log-report xmlns:S="svn:" xmlns:D="DAV:">
        <S:log-item>
        <D:version-name>0</D:version-name>
        <S:date>2011-09-18T13:20:54.561302Z</S:date>
        </S:log-item>
        <S:log-item>
        */
        const saxStream = sax.createStream(true, {
          xmlns: true,
          position: false,
          trim: true
        });

        const entries = [];
        let entry;
        let consume = ignore;

        saxStream.on('opentag', node => {
          switch (node.local) {
            case 'log-item':
              entry = {};
              consume = ignore;
              break;
            case 'version-name':
              consume = text => {
                entry.version = parseInt(text, 10);
                consume = ignore;
              };
              break;
            case 'date':
              consume = text => {
                entry.date = new Date(text);
                consume = ignore;
              };
              break;
            case 'comment':
              consume = text => {
                entry.message = entry.message ? entry.message + text : text;
              };
              break;
            case 'creator-displayname':
              consume = text => {
                entry.creator = text;
                consume = ignore;
              };
              break;
            default:
              consume = ignore;
          }
        });

        saxStream.on('closetag', name => {
          switch (name) {
            case 'S:log-item':
              entries.push(entry);
              break;
          }
        });

        saxStream.on('text', text => {
          consume(text);
        });
        saxStream.on('end', () => fullfill(entries));
        saxStream.on('error', reject);
        response.body.pipe(saxStream);
      })
    );
  }
}

/*
OPTIONS /svn/delivery_notes HTTP/1.1
Content-Type: text/xml
DAV: http://subversion.tigris.org/xmlns/dav/svn/depth
DAV: http://subversion.tigris.org/xmlns/dav/svn/mergeinfo
DAV: http://subversion.tigris.org/xmlns/dav/svn/log-revprops
Content-Length: 131

<?xml version="1.0" encoding="utf-8"?><D:options xmlns:D="DAV:"><D:activity-collection-set></D:activity-collection-set></D:options>
*/
function init(url, options) {

}

export {
  SVNHTTPSScheme,
  headerIntoSet,
  encodeProperties
};
