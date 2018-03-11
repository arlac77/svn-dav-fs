[![npm](https://img.shields.io/npm/v/svn-dav-fs.svg)](https://www.npmjs.com/package/svn-dav-fs)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/svn-dav-fs.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/svn-dav-fs)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://secure.travis-ci.org/arlac77/svn-dav-fs.png)](http://travis-ci.org/arlac77/svn-dav-fs)
[![bithound](https://www.bithound.io/github/arlac77/svn-dav-fs/badges/score.svg)](https://www.bithound.io/github/arlac77/svn-dav-fs)
[![codecov.io](http://codecov.io/github/arlac77/svn-dav-fs/coverage.svg?branch=master)](http://codecov.io/github/arlac77/svn-dav-fs?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/svn-dav-fs/badge.svg)](https://coveralls.io/r/arlac77/svn-dav-fs)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/svn-dav-fs/badge.svg)](https://snyk.io/test/github/arlac77/svn-dav-fs)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/svn-dav-fs.svg?style=flat-square)](https://github.com/arlac77/svn-dav-fs/issues)
[![Stories in Ready](https://badge.waffle.io/arlac77/svn-dav-fs.svg?label=ready&title=Ready)](http://waffle.io/arlac77/svn-dav-fs)
[![Dependency Status](https://david-dm.org/arlac77/svn-dav-fs.svg)](https://david-dm.org/arlac77/svn-dav-fs)
[![devDependency Status](https://david-dm.org/arlac77/svn-dav-fs/dev-status.svg)](https://david-dm.org/arlac77/svn-dav-fs#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/svn-dav-fs.svg?branch=master)](http://inch-ci.org/github/arlac77/svn-dav-fs)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![downloads](http://img.shields.io/npm/dm/svn-dav-fs.svg?style=flat-square)](https://npmjs.org/package/svn-dav-fs)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# svn-dav-fs

handler for 'svn+https' url scheme (plain js svn dav fs)

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [SVNHTTPSScheme](#svnhttpsscheme)
    -   [options](#options)
    -   [activityCollectionSet](#activitycollectionset)
    -   [userAgent](#useragent)
    -   [clientVersion](#clientversion)
    -   [davHeader](#davheader)
    -   [mkcol](#mkcol)
    -   [startTransaction](#starttransaction)
    -   [put](#put)
-   [ActivityCollectionSet](#activitycollectionset-1)
    -   [repositoryRoot](#repositoryroot)
    -   [absoluteRepositoryRoot](#absoluterepositoryroot)
    -   [pathInsideRepository](#pathinsiderepository)
-   [encodeProperties](#encodeproperties)

## SVNHTTPSScheme

**Extends HTTPSScheme**

URL scheme 'svn+https' svn over https

### options

Execute options request

**Parameters**

-   `context` **Context** execution context
-   `url` **[URL](https://developer.mozilla.org/docs/Web/API/URL/URL)** 
-   `body` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** xml lines

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Request](https://developer.mozilla.org/Add-ons/SDK/High-Level_APIs/request)>** 

### activityCollectionSet

query for the activity collection set.

**Parameters**

-   `context` **Context** execution context
-   `url` **[URL](https://developer.mozilla.org/docs/Web/API/URL/URL)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[ActivityCollectionSet](#activitycollectionset)>** 

### userAgent

Delivers svn user agent

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** user agent identifier

### clientVersion

Delivers svn client version

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** version

### davHeader

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

### mkcol

<!-- skip-example -->

**Parameters**

-   `context` **Context** 
-   `url` **[URL](https://developer.mozilla.org/docs/Web/API/URL/URL)** 
-   `tx` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

**Examples**

```javascript
MKCOL /svn/delivery_notes/!svn/txr/1485-1cs/data/comp2 HTTP/1.1
DAV	http://subversion.tigris.org/xmlns/dav/svn/depth
DAV	http://subversion.tigris.org/xmlns/dav/svn/mergeinfo
DAV	http://subversion.tigris.org/xmlns/dav/svn/log-revprops
```

### startTransaction

<!-- skip-example -->

Start a new transaction

**Parameters**

-   `context` **Context** 
-   `url` **ULR** 
-   `message` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

**Examples**

```javascript
POST /svn/delivery_notes/!svn/me HTTP/1.1
Content-Type	application/vnd.svn-skel
DAV	http://subversion.tigris.org/xmlns/dav/svn/depth
DAV	http://subversion.tigris.org/xmlns/dav/svn/mergeinfo
DAV	http://subversion.tigris.org/xmlns/dav/svn/log-revprops
(create-txn-with-props (svn:txn-user-agent 48 SVN/1.9.4 (x86_64-apple-darwin15.0.0) serf/1.3.8 svn:log 19 this is the message svn:txn-client-compat-version 5 1.9.4))
Response:
SVN-Txn-Name: 1483-1a1
```

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** acs, txn

### put

-   **See: <http://svn.apache.org/repos/asf/subversion/trunk/notes/svndiff>**
-   **See: <http://stackoverflow.com/questions/24865265/how-to-do-svn-http-request-checkin-commit-within-html>**
-   **See: <https://git.tmatesoft.com/repos/svnkit.git>**

**Parameters**

-   `context` **Context** 
-   `url` **[URL](https://developer.mozilla.org/docs/Web/API/URL/URL)** 
-   `stream` **ReadableStream** 
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

## ActivityCollectionSet

**Parameters**

-   `url` **[URL](https://developer.mozilla.org/docs/Web/API/URL/URL)** 
-   `attributes` **[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** 
-   `davFeatures` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** 
-   `allowedMethods` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** 

**Properties**

-   `url` **[URL](https://developer.mozilla.org/docs/Web/API/URL/URL)** 
-   `attributes` **[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** 
-   `davFeatures` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** 
-   `allowedMethods` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** 

### repositoryRoot

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

### absoluteRepositoryRoot

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

### pathInsideRepository

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** path of the url inside of the repository

## encodeProperties

<!-- skip-example -->

Encodes objects into strings as used by svn

**Parameters**

-   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** to be encoded

**Examples**

```javascript
(create-txn-with-props
   (svn:txn-user-agent 48 SVN/1.9.4 (x86_64-apple-darwin15.0.0) serf/1.3.8
    svn:log 19 this is the message
    svn:txn-client-compat-version 5 1.9.4))
```

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** encoded object value

# install

With [npm](http://npmjs.org) do:

```shell
npm install svn-dav-fs
```

# license

BSD-2-Clause
