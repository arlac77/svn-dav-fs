import { HTTPSScheme } from "url-resolver-fs";

import { ActivityCollectionSet } from "./activity-collection-set";
import { headerIntoSet, encodeProperties } from "./util";
export { headerIntoSet, encodeProperties };

const { createStream } = require("sax");
const hasha = require("hasha");

const XML_HEADER = '<?xml version="1.0" encoding="utf-8"?>';
const XML_CONTENT_TYPE = "text/xml";
const SVN_SKEL_CONTENT_TYPE = "application/vnd.svn-skel";
const SVN_SVNDIFF_CONTENT_TYPE = "application/vnd.svn-svndiff";

const NS_SVN_DAV = "http://subversion.tigris.org/xmlns/dav/";
const NS_SVN_DAV_DEPTH = NS_SVN_DAV + "svn/depth";
const NS_SVN_DAV_MERGINFO = NS_SVN_DAV + "svn/mergeinfo";
const NS_SVN_DAV_LOG_REVPROPS = NS_SVN_DAV + "svn/log-revprops";

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
  "SVN-Repository-UUID",
  "SVN-Repository-Root",
  "SVN-Rev-Root-Stub", // /svn/delivery_notes/!svn/rvr
  "SVN-Rev-Stub", // /svn/delivery_notes/!svn/rev
  "SVN-Txn-Root-Stub", // /svn/delivery_notes/!svn/vtxr
  "SVN-Txn-Stub", // /svn/delivery_notes/!svn/txn

  "SVN-Me-Resource", // /svn/delivery_notes/!svn/me
  "SVN-Rev-Root-Stub", // /svn/delivery_notes/!svn/rvr

  "SVN-Youngest-Rev", // Integer
  "SVN-Allow-Bulk-Updates", // Prefer
  "SVN-Supported-Posts", // create-txn create-txn-with-props
  "SVN-Repository-MergeInfo" // yes
];

function ignore() {}

/**
 * URL scheme 'svn+https' svn over https
 */
export class SVNHTTPSScheme extends HTTPSScheme {
  static get name() {
    return "svn+https";
  }

  /**
   * Execute options request
   * @param {Context} context execution context
   * @param {URL} url
   * @param {string[]} body xml lines
   * @return {Promise<Request>}
   */
  optionsRequest(context, url, body) {
    return this.fetch(context, url, {
      method: "OPTIONS",
      body: [XML_HEADER, ...body].join(""),
      headers: {
        dav: this.davHeader,
        "content-type": XML_CONTENT_TYPE
      }
    });
  }

  /**
   * query for the activity collection set.
   * @param {Context} context execution context
   * @param {URL} url
   * @return {Promise<ActivityCollectionSet>}
   */
  async activityCollectionSet(context, url) {
    const options = await this.optionsRequest(context, url, [
      '<D:options xmlns:D="DAV:">',
      "<D:activity-collection-set></D:activity-collection-set>",
      "</D:options>"
    ]);

    const attributes = new Map();
    const davFeatures = new Set();
    const allowedMethods = new Set();

    SVNHeaders.forEach(h => {
      const v = options.headers.get(h);
      if (v !== undefined) {
        attributes.set(h, v);
      }
    });

    headerIntoSet(options.headers.get("dav"), davFeatures);
    headerIntoSet(options.headers.get("allow"), allowedMethods);

    attributes.set(
      "SVN-Youngest-Rev",
      parseInt(options.headers.get("SVN-Youngest-Rev"), 10)
    );

    return new ActivityCollectionSet(
      url,
      attributes,
      davFeatures,
      allowedMethods
    );
  }

  /**
   * Delivers svn user agent
   * @return {string} user agent identifier
   */
  get userAgent() {
    return "SVN/1.9.4 (x86_64-apple-darwin15.0.0) serf/1.3.8";
  }

  /**
   * Delivers svn client version
   * @return {string} version
   */
  get clientVersion() {
    return "1.9.4";
  }

  /**
   * @type {string}
   */
  get davHeader() {
    return [
      NS_SVN_DAV_DEPTH,
      NS_SVN_DAV_MERGINFO,
      NS_SVN_DAV_LOG_REVPROPS
    ].join(",");
  }

  /**
   * <!-- skip-example -->
   * @example
   * MKCOL /svn/delivery_notes/!svn/txr/1485-1cs/data/comp2 HTTP/1.1
   * DAV	http://subversion.tigris.org/xmlns/dav/svn/depth
   * DAV	http://subversion.tigris.org/xmlns/dav/svn/mergeinfo
   * DAV	http://subversion.tigris.org/xmlns/dav/svn/log-revprops
   * @param {Context} context
   * @param {URL} url
   * @param {string} tx
   */
  async mkcol(context, url, tx) {
    return this.fetch(context, url, {
      method: "MKCOL",
      headers: {
        dav: this.davHeader
      }
    });
  }

  /**
   * <!-- skip-example -->
   * Start a new transaction
   * @param {Context} context
   * @param {ULR} url
   * @param {string} message
   * @return {Object} acs, txn
   * @example
   * POST /svn/delivery_notes/!svn/me HTTP/1.1
   * Content-Type	application/vnd.svn-skel
   * DAV	http://subversion.tigris.org/xmlns/dav/svn/depth
   * DAV	http://subversion.tigris.org/xmlns/dav/svn/mergeinfo
   * DAV	http://subversion.tigris.org/xmlns/dav/svn/log-revprops
   * (create-txn-with-props (svn:txn-user-agent 48 SVN/1.9.4 (x86_64-apple-darwin15.0.0) serf/1.3.8 svn:log 19 this is the message svn:txn-client-compat-version 5 1.9.4))
   * Response:
   * SVN-Txn-Name: 1483-1a1
   */
  async startTransaction(context, url, message) {
    const acs = await this.activityCollectionSet(context, url);

    const response = await this.fetch(
      context,
      acs.absoluteRepositoryRoot + "/!svn/me",
      {
        method: "POST",
        body: encodeProperties({
          "create-txn-with-props": {
            "svn:txn-user-agent": this.userAgent,
            "svn:log": message,
            "svn:txn-client-compat-version": this.clientVersion
          }
        }),
        headers: {
          dav: this.davHeader,
          "content-type": SVN_SKEL_CONTENT_TYPE
        }
      }
    );

    const txn = response.headers.get("SVN-Txn-Name");

    if (txn === undefined) {
      throw new Error(`Can't create transaction: ${url}`);
    }

    return { acs, txn };
  }

  /**
   * @see http://svn.apache.org/repos/asf/subversion/trunk/notes/svndiff
   * @see http://stackoverflow.com/questions/24865265/how-to-do-svn-http-request-checkin-commit-within-html
   * @see https://git.tmatesoft.com/repos/svnkit.git
   * @param {Context} context
   * @param {URL} url
   * @param {ReadableStream} stream
   * @param {Object} options
   */
  async put(context, url, stream, options) {
    const { acs, txn } = await this.startTransaction(
      context,
      url,
      options.message
    );
    const [versionName] = txn.split(/\-/);

    //const pathInsideRepository = '/data/releases.json';

    const hashResult = await hasha.stream(stream, { algorithm: "md5" });

    const r2 = await this.fetch(
      context,
      acs.absoluteRepositoryRoot +
        `/!svn/txr/${txn}/${acs.pathInsideRepository}`,
      {
        method: "PUT",

        //"body": { "encoding": "base64", "encoded": "U1ZOAAAlGQMEFQCEXQp9Cg==" }
        body: "U1ZOAAAlGQMEFQCEXQp9Cg==",
        headers: {
          dav: this.davHeader,
          "content-type": SVN_SVNDIFF_CONTENT_TYPE,
          "X-SVN-Version-Name": versionName,

          // MD5 (releases.json) = fc0c6bba9a0b8c2079be6a6c05b1b915
          "X-SVN-Base-Fulltext-MD5": "528454b50ad14b271f18e4e763a4a951",
          "X-SVN-Result-Fulltext-MD5": hashResult //'fc0c6bba9a0b8c2079be6a6c05b1b915'
        }
      }
    );

    console.log(r2);

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

  async stat(context, url, options) {
    const acs = await this.activityCollectionSet(context, url);
    const path = url.href.substring(
      url.origin.length + acs.repositoryRoot.length
    );
    const u2 = new URL(
      `${url.origin}${acs.attributes.get(
        "SVN-Rev-Root-Stub"
      )}/${acs.attributes.get("SVN-Youngest-Rev")}${path}`
    );

    const properties = await this.propfind(
      context,
      u2,
      {
        resourcetype: "DAV:",
        getcontentlength: "DAV:",
        "deadprop-count": "http://subversion.tigris.org/xmlns/dav/",
        "version-name": "DAV:",
        creationdate: "DAV:",
        "creator-displayname": "DAV:"
      },
      0
    );

    return properties[0];
  }

  async propfind(context, url, properties, depth = 1) {
    const xmls = [XML_HEADER, '<D:propfind xmlns:D="DAV:">'];
    if (properties === undefined) {
      xmls.push("<D:allprop/>");
    } else {
      xmls.push("<D:prop>");
      for (const p in properties) {
        xmls.push(`<${p} xmlns="${properties[p]}"/>`);
      }
      xmls.push("</D:prop>");
    }

    xmls.push("</D:propfind>");

    const response = await this.fetch(context, url, {
      method: "PROPFIND",
      body: xmls.join("\n"),
      headers: {
        dav: this.davHeader,
        depth: depth,
        "content-type": XML_CONTENT_TYPE
      }
    });

    return new Promise((resolve, reject) => {
      const entries = [];
      let entry;
      let consume = ignore;
      let rootPathPrefixLength;

      const saxStream = createStream(true, {
        xmlns: true,
        position: false,
        trim: true
      });

      saxStream.on("opentag", node => {
        switch (node.local) {
          case "response":
            break;
          case "prop":
            entry = {};
            consume = ignore;
            break;
          case "collection":
            entry.collection = true;
            break;
          case "version-name":
            consume = text => {
              entry.version = parseInt(text, 10);
              consume = ignore;
            };
            break;
          case "getcontentlength":
            consume = text => {
              entry.size = parseInt(text, 10);
              consume = ignore;
            };
            break;
          case "creator-displayname":
            consume = text => {
              entry.creator = text;
              consume = ignore;
            };
            break;
          case "creationdate":
            consume = text => {
              entry.creationDate = new Date(text);
              consume = ignore;
            };
            break;
          case "baseline-relative-path":
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

      saxStream.on("closetag", name => {
        switch (name) {
          case "D:prop":
            if (entry !== undefined) {
              entries.push(entry);
            }
            break;
        }
      });

      saxStream.on("text", text => consume(text));
      saxStream.on("end", () => resolve(entries));
      saxStream.on("error", reject);
      response.body.pipe(saxStream);
    });
  }

  async *list(context, url, options) {
    for (const entry of await this.propfind(context, url, options)) {
      yield entry;
    }
  }

  async history(context, url, options = {}) {
    let start;
    if (options.version === undefined) {
      const entries = await this.list(context, url);
      start = entries[0].version;
    } else {
      start = options.version;
    }

    const direction =
      options.direction || options.version === undefined
        ? "backward"
        : "forward";
    const chunkSize = options.chunkSize || 1000;

    let end = direction === "forward" ? start + chunkSize : start - chunkSize;
    if (end < 0) {
      end = 0;
    }
    if (start > end) {
      const t = start;
      start = end;
      end = t;
    }

    const entries = await this._history(context, url, start, end);

    const self = this;

    return function*() {
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
    };
  }

  async _history(context, url, start, end) {
    const xmls = [
      XML_HEADER,
      '<S:log-report xmlns:S="svn:">',
      `<S:start-revision>${start}</S:start-revision>`,
      `<S:end-revision>${end}</S:end-revision>`
    ];
    ["svn:author", "svn:date", "svn:log"].forEach(item =>
      xmls.push(`<S:revprop>${item}</S:revprop>`)
    );

    xmls.push("<S:path/>");
    xmls.push("</S:log-report>");

    const response = await this.fetch(context, url, {
      method: "REPORT",
      body: xmls.join("\n"),
      headers: {
        dav: this.davHeader,
        "content-type": XML_CONTENT_TYPE
      }
    });

    return new Promise((resolve, reject) => {
      /*
        <S:log-report xmlns:S="svn:" xmlns:D="DAV:">
        <S:log-item>
        <D:version-name>0</D:version-name>
        <S:date>2011-09-18T13:20:54.561302Z</S:date>
        </S:log-item>
        <S:log-item>
        */
      const saxStream = createStream(true, {
        xmlns: true,
        position: false,
        trim: true
      });

      const entries = [];
      let entry;
      let consume = ignore;

      saxStream.on("opentag", node => {
        switch (node.local) {
          case "log-item":
            entry = {};
            consume = ignore;
            break;
          case "version-name":
            consume = text => {
              entry.version = parseInt(text, 10);
              consume = ignore;
            };
            break;
          case "date":
            consume = text => {
              entry.date = new Date(text);
              consume = ignore;
            };
            break;
          case "comment":
            consume = text => {
              entry.message = entry.message ? entry.message + text : text;
            };
            break;
          case "creator-displayname":
            consume = text => {
              entry.creator = text;
              consume = ignore;
            };
            break;
          default:
            consume = ignore;
        }
      });

      saxStream.on("closetag", name => {
        switch (name) {
          case "S:log-item":
            entries.push(entry);
            break;
        }
      });

      saxStream.on("text", text => consume(text));
      saxStream.on("end", () => resolve(entries));
      saxStream.on("error", reject);
      response.body.pipe(saxStream);
    });
  }
}
