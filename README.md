[![npm](https://img.shields.io/npm/v/svn-dav-fs.svg)](https://www.npmjs.com/package/svn-dav-fs)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/svn-dav-fs)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/svn-dav-fs)
[![Build Status](https://secure.travis-ci.org/arlac77/svn-dav-fs.png)](http://travis-ci.org/arlac77/svn-dav-fs)
[![bithound](https://www.bithound.io/github/arlac77/svn-dav-fs/badges/score.svg)](https://www.bithound.io/github/arlac77/svn-dav-fs)
[![codecov.io](http://codecov.io/github/arlac77/svn-dav-fs/coverage.svg?branch=master)](http://codecov.io/github/arlac77/svn-dav-fs?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/svn-dav-fs/badge.svg)](https://coveralls.io/r/arlac77/svn-dav-fs)
[![Code Climate](https://codeclimate.com/github/arlac77/svn-dav-fs/badges/gpa.svg)](https://codeclimate.com/github/arlac77/svn-dav-fs)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/svn-dav-fs/badge.svg)](https://snyk.io/test/github/arlac77/svn-dav-fs)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/svn-dav-fs.svg?style=flat-square)](https://github.com/arlac77/svn-dav-fs/issues)
[![Stories in Ready](https://badge.waffle.io/arlac77/svn-dav-fs.svg?label=ready&title=Ready)](http://waffle.io/arlac77/svn-dav-fs)
[![Dependency Status](https://david-dm.org/arlac77/svn-dav-fs.svg)](https://david-dm.org/arlac77/svn-dav-fs)
[![devDependency Status](https://david-dm.org/arlac77/svn-dav-fs/dev-status.svg)](https://david-dm.org/arlac77/svn-dav-fs#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/svn-dav-fs.svg?branch=master)](http://inch-ci.org/github/arlac77/svn-dav-fs)
[![downloads](http://img.shields.io/npm/dm/svn-dav-fs.svg?style=flat-square)](https://npmjs.org/package/svn-dav-fs)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

svn-dav-fs
==========
handler for 'svn+https' url scheme (plain js svn dav fs)

# API Reference
- svn-dav-fs

  <a name="encodeProperties"></a>

## encodeProperties(object) ⇒ <code>string</code>
Encodes objects into strings as used by svn

**Kind**: global function  
**Returns**: <code>string</code> - encoded object value  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | to be encoded |

**Example**  
(create-txn-with-props
   (svn:txn-user-agent 48 SVN/1.9.4 (x86_64-apple-darwin15.0.0) serf/1.3.8
    svn:log 19 this is the message
    svn:txn-client-compat-version 5 1.9.4))
  <a name="module_svn-dav-fs..SVNHTTPSScheme+options"></a>

## module:svn-dav-fs~SVNHTTPSScheme.options(url, body) ⇒ <code>promise</code>
Exec options request

**Kind**: instance method of <code>module:svn-dav-fs~SVNHTTPSScheme</code>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> |  |
| body | <code>Array.&lt;string&gt;</code> | xml lines |

  <a name="module_svn-dav-fs..SVNHTTPSScheme+activityCollectionSet"></a>

## module:svn-dav-fs~SVNHTTPSScheme.activityCollectionSet(url) ⇒ <code>Promise</code>
query the activity collection set.

**Kind**: instance method of <code>module:svn-dav-fs~SVNHTTPSScheme</code>  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 

  <a name="module_svn-dav-fs..SVNHTTPSScheme+put"></a>

## module:svn-dav-fs~SVNHTTPSScheme.put()
http://svn.apache.org/repos/asf/subversion/trunk/notes/svndiff
http://stackoverflow.com/questions/24865265/how-to-do-svn-http-request-checkin-commit-within-html

**Kind**: instance method of <code>module:svn-dav-fs~SVNHTTPSScheme</code>  
* * *

install
=======

With [npm](http://npmjs.org) do:

```shell
npm install svn-dav-fs
```

license
=======

BSD-2-Clause
