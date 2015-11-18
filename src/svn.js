import fetch from 'node-fetch';
const btoa = require('btoa');

const NS_S = 'svn:';
const NS_D = 'DAV:';
const NS_SVNDAV = 'http://subversion.tigris.org/xmlns/dav/';
const NS_SVNDAV_DEPTH = 'http://subversion.tigris.org/xmlns/dav/svn/depth';
const NS_SVNDAV_MERGINFO = 'http://subversion.tigris.org/xmlns/dav/svn/mergeinfo';
const NS_SVNDAV_LOG_REVPROPS = 'http://subversion.tigris.org/xmlns/dav/svn/log-revprops';
const NS_SVNDAV_ATOMIC_REVPROPS = 'http://subversion.tigris.org/xmlns/dav/svn/atomic-revprops';
const NS_SVNDAV_PARTIAL_REPLAY = 'http://subversion.tigris.org/xmlns/dav/svn/partial-replay';

const headers = [
  'SVN-Repository-UUID',
  'SVN-Repository-Root',
  'SVN-Rev-Root-Stub',
  'SVN-Rev-Stub',
  'SVN-Txn-Root-Stub',
  'SVN-Txn-Stub',
  'SVN-Me-Resource'
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
    report(url,start,end) {
  		if(end - start > 1000) start = end - 1000;

  		var xml = '<?xml version="1.0" encoding="UTF-8" ?>\n';
  		xml += '<S:log-report xmlns:S="svn:">\n';
  		xml += '<S:start-revision>'+start+'</S:start-revision>\n';
  		xml += '<S:end-revision>'+end+'</S:end-revision>\n';

  		const properties = ['svn:author','svn:date','svn:log'];
  		properties.forEach((item) => { xml += '<S:revprop>' + item + '</S:revprop>'; });
  		xml += '<S:path/>\n';
  		xml += '</S:log-report>\n';

  		return fetch(url,{
  			method: 'REPORT',
  			body: xml,
  			headers: {
  				"Authorization" : svn.basicAuthorization,
  				"DAV" : [ NS_SVNDAV_DEPTH, NS_SVNDAV_MERGINFO, NS_SVNDAV_LOG_REVPROPS ].join(','),
  				"Content-type" : "text/xml; charset=UTF-8"
  			}});
      }
};

export function init(url, options) {

  const attributes = {};

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
  });

  return fetch(url, {
    method: 'OPTIONS',
    body: '<?xml version="1.0" encoding="utf-8"?><D:options xmlns:D="DAV:"><D:activity-collection-set/></D:options>\n',
    headers: {
      "Authorization": svn.basicAuthorization,
      "DAV": [NS_SVNDAV_DEPTH, NS_SVNDAV_MERGINFO, NS_SVNDAV_LOG_REVPROPS].join(','),
      "Content-type": "text/xml; charset=UTF-8"
    }
  }).then(function (response) {
    headers.forEach( h => {
      attributes[h] = response.headers.get(h);
    });

    attributes['SVN-Youngest-Rev'] = parseInt(response.headers.get('SVN-Youngest-Rev'), 10);

    console.log(`${JSON.stringify(attributes)}`);
    return svn;
  });
}
