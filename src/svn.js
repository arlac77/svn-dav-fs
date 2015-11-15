import fetch from 'fetch';

const NS_S					  = 'svn:';
const NS_D					  = 'DAV:';
const NS_SVNDAV                 = "http://subversion.tigris.org/xmlns/dav/";
const NS_SVNDAV_DEPTH           = "http://subversion.tigris.org/xmlns/dav/svn/depth";
const NS_SVNDAV_MERGINFO        = "http://subversion.tigris.org/xmlns/dav/svn/mergeinfo";
const NS_SVNDAV_LOG_REVPROPS    = "http://subversion.tigris.org/xmlns/dav/svn/log-revprops";
const NS_SVNDAV_ATOMIC_REVPROPS = "http://subversion.tigris.org/xmlns/dav/svn/atomic-revprops";
const NS_SVNDAV_PARTIAL_REPLAY  = "http://subversion.tigris.org/xmlns/dav/svn/partial-replay";

const SVN = {};

export function init()
{
  return 1;
}
