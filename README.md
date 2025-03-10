[![npm](https://img.shields.io/npm/v/svn-dav-fs.svg)](https://www.npmjs.com/package/svn-dav-fs)
[![License](https://img.shields.io/badge/License-0BSD-blue.svg)](https://spdx.org/licenses/0BSD.html)
[![bundlejs](https://deno.bundlejs.com/?q=svn-dav-fs\&badge=detailed)](https://bundlejs.com/?q=svn-dav-fs)
[![downloads](http://img.shields.io/npm/dm/svn-dav-fs.svg?style=flat-square)](https://npmjs.org/package/svn-dav-fs)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/svn-dav-fs.svg?style=flat-square)](https://github.com/arlac77/svn-dav-fs/issues)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Farlac77%2Fsvn-dav-fs%2Fbadge\&style=flat)](https://actions-badge.atrox.dev/arlac77/svn-dav-fs/goto)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/svn-dav-fs/badge.svg)](https://snyk.io/test/github/arlac77/svn-dav-fs)
[![Coverage Status](https://coveralls.io/repos/arlac77/svn-dav-fs/badge.svg)](https://coveralls.io/github/arlac77/svn-dav-fs)

# svn-dav-fs

handler for 'svn+https' url scheme (plain js svn dav fs)

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

*   [ActivityCollectionSet](#activitycollectionset)
    *   [Parameters](#parameters)
    *   [Properties](#properties)
    *   [repositoryRoot](#repositoryroot)
    *   [absoluteRepositoryRoot](#absoluterepositoryroot)
    *   [pathInsideRepository](#pathinsiderepository)
*   [SVNHTTPSScheme](#svnhttpsscheme)
    *   [optionsRequest](#optionsrequest)
        *   [Parameters](#parameters-1)
    *   [activityCollectionSet](#activitycollectionset-1)
        *   [Parameters](#parameters-2)
    *   [userAgent](#useragent)
    *   [clientVersion](#clientversion)
    *   [davHeader](#davheader)
    *   [mkcol](#mkcol)
        *   [Parameters](#parameters-3)
        *   [Examples](#examples)
    *   [startTransaction](#starttransaction)
        *   [Parameters](#parameters-4)
        *   [Examples](#examples-1)
    *   [put](#put)
        *   [Parameters](#parameters-5)
    *   [optionsFromEnvironment](#optionsfromenvironment)
        *   [Parameters](#parameters-6)
*   [encodeProperties](#encodeproperties)
    *   [Parameters](#parameters-7)
    *   [Examples](#examples-2)

## ActivityCollectionSet

### Parameters

*   `url` **[URL](https://developer.mozilla.org/docs/Web/API/URL/URL)**&#x20;
*   `attributes` **[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>**&#x20;
*   `davFeatures` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>**&#x20;
*   `allowedMethods` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>**&#x20;

### Properties

*   `url` **[URL](https://developer.mozilla.org/docs/Web/API/URL/URL)**&#x20;
*   `attributes` **[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>**&#x20;
*   `davFeatures` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>**&#x20;
*   `allowedMethods` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>**&#x20;

### repositoryRoot

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

### absoluteRepositoryRoot

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

### pathInsideRepository

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** path of the url inside of the repository

## SVNHTTPSScheme

**Extends HTTPSScheme**

URL scheme 'svn+https' svn over https

### optionsRequest

Execute options request

#### Parameters

*   `context` **Context** execution context
*   `url` **[URL](https://developer.mozilla.org/docs/Web/API/URL/URL)**&#x20;
*   `body` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** xml lines

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Request](https://developer.mozilla.org/Add-ons/SDK/High-Level_APIs/request)>**&#x20;

### activityCollectionSet

query for the activity collection set.

#### Parameters

*   `context` **Context** execution context
*   `url` **[URL](https://developer.mozilla.org/docs/Web/API/URL/URL)**&#x20;

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[ActivityCollectionSet](#activitycollectionset)>**&#x20;

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

#### Parameters

*   `context` **Context**&#x20;
*   `url` **[URL](https://developer.mozilla.org/docs/Web/API/URL/URL)**&#x20;
*   `tx` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

#### Examples

```javascript
MKCOL /svn/delivery_notes/!svn/txr/1485-1cs/data/comp2 HTTP/1.1
DAV	http://subversion.tigris.org/xmlns/dav/svn/depth
DAV	http://subversion.tigris.org/xmlns/dav/svn/mergeinfo
DAV	http://subversion.tigris.org/xmlns/dav/svn/log-revprops
```

### startTransaction

<!-- skip-example -->

Start a new transaction

#### Parameters

*   `context` **Context**&#x20;
*   `url` **ULR**&#x20;
*   `message` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

#### Examples

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

*   **See**: <http://svn.apache.org/repos/asf/subversion/trunk/notes/svndiff>
*   **See**: <http://stackoverflow.com/questions/24865265/how-to-do-svn-http-request-checkin-commit-within-html>
*   **See**: <https://git.tmatesoft.com/repos/svnkit.git>

#### Parameters

*   `context` **Context**&#x20;
*   `url` **[URL](https://developer.mozilla.org/docs/Web/API/URL/URL)**&#x20;
*   `stream` **ReadableStream**&#x20;
*   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;

### optionsFromEnvironment

Extract options suitable for the constructor
form the given set of environment variables

#### Parameters

*   `env` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** undefined if no suitable environment variables have been found

## encodeProperties

<!-- skip-example -->

Encodes objects into strings as used by svn

### Parameters

*   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** to be encoded

### Examples

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
