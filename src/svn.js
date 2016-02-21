/* jslint node: true, esnext: true */

"use strict";

// nodejs
//if (IS_NODE) {
const btoa = require('btoa'),
  sax = require('sax');
import fetch from 'isomorphic-fetch';
//} else {
// browser
//  import fetch from 'fetch';
//}

const XML_HEADER = '<?xml version="1.0" encoding="utf-8"?>';
const XML_CONTENT_TYPE = 'text/xml';

//const NS_S = 'svn:';
//const NS_D = 'DAV:';

const NS_SVN_DAV = "http://subversion.tigris.org/xmlns/dav/";
const NS_SVN_DAV_DEPTH = NS_SVN_DAV + "svn/depth";
const NS_SVN_DAV_MERGINFO = NS_SVN_DAV + "svn/mergeinfo";
const NS_SVN_DAV_LOG_REVPROPS = NS_SVN_DAV + "svn/log-revprops";

/*
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

const SVN = {
  toString() {
      return "svn";
    },
    get basicAuthorization() {
      return 'Basic ' + btoa(this.credentials.user + ':' + this.credentials.password);
    },
    get vccDefault() {
      return [this.attributes['SVN-Repository-Root'], '!svn/vcc/default'].join('/');
    },
    get davHeader() {
      return [NS_SVN_DAV_DEPTH, NS_SVN_DAV_MERGINFO, NS_SVN_DAV_LOG_REVPROPS].join(',');
    },
    list(url, properties) {
      const depth = 1;
      const xmls = [XML_HEADER, '<D:propfind xmlns:D="DAV:">'];

      if (properties === undefined) {
        xmls.push('<D:allprop/>');
      } else {
        for (const p in properties) {
          xmls.push(`<D:prop><${p} xmlns=\"${properties[p]}\"/></D:prop>`);
        }
      }

      xmls.push('</D:propfind>');

      return fetch(url, {
        method: 'PROPFIND',
        body: xmls.join('\n'),
        headers: {
          'authorization': this.basicAuthorization,
          'dav': this.davHeader,
          'depth': depth,
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
            position: false
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

          saxStream.on('text', text => {
            consume(text);
          });

          saxStream.on('end', () => fullfill(function* () {
            for (const i in entries) {
              yield Promise.resolve(entries[i]);
            }
          }));
          saxStream.on('error', reject);
          //response.body.pipe(process.stdout);

          response.body.pipe(saxStream);
        });

      });
    },
    history(url, options) {
      const p = options.version === undefined ?
        this.list(url).then(entry => Promise.resolve(entry.version)) : Promise.resolve(options.version);

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

        const xmls = [XML_HEADER, '<S:log-report xmlns:S="svn:">'];
        xmls.push(`<S:start-revision>${start}</S:start-revision>`);
        xmls.push(`<S:end-revision>${end}</S:end-revision>`);
        ['svn:author', 'svn:date', 'svn:log'].forEach(item => xmls.push(`<S:revprop>${item}</S:revprop>`));

        xmls.push('<S:path/>');
        xmls.push('</S:log-report>');

        return fetch(url, {
          method: 'REPORT',
          body: xmls.join('\n'),
          headers: {
            'authorization': this.basicAuthorization,
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
              position: false
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
            saxStream.on('end', () => {
              fullfill(function* () {
                for (const i in entries) {
                  yield Promise.resolve(entries[i]);
                }
              });
            });
            saxStream.on('error', reject);
            response.body.pipe(saxStream);
          })
        );
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
      'authorization': svn.basicAuthorization,
      'dav': svn.davHeader,
      //'user-agent': 'SVN/1.9.2 (x86_64-apple-darwin15.0.0) serf/1.3.8',
      //'connection': "keep-alive",
      'content-type': XML_CONTENT_TYPE
    }
  }).then(response => {
    const headers = response.headers._headers ? response.headers._headers : response.headers.map;

    //const headers = response.headers._headers;
    //console.log(`Headers ${JSON.stringify(response)}`);
    //console.log(`RAW headers: ${JSON.stringify(response.headers.map)}`);

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
    }
    return svn;
  });
}

function headerIntoSet(header, target) {
  if (header) {
    header.forEach(h => h.split(/\s*,\s*/).forEach(e => target.add(e)));
  }
}
