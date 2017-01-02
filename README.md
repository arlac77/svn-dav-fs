[![npm](https://img.shields.io/npm/v/svn-dav-fs.svg)](https://www.npmjs.com/package/svn-dav-fs)
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

  <a name="encodeProperties"></a>

## encodeProperties(object) ⇒ <code>String</code>
Encodes objects into strings as used by svn
(create-txn-with-props (svn:txn-user-agent 48 SVN/1.9.4 (x86_64-apple-darwin15.0.0) serf/1.3.8 svn:log 19 this is the message svn:txn-client-compat-version 5 1.9.4))

**Kind**: global function  
**Returns**: <code>String</code> - encoded object value  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | to be encoded |

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
