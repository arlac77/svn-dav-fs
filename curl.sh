


curl --basic --user $SVN_USER:$SVN_PASSWORD\
     -X POST -v\
     --data '(create-txn-with-props (svn:txn-user-agent 48 SVN/1.9.4 (x86_64-apple-darwin15.0.0) serf/1.3.8 svn:log 19 this is the message svn:txn-client-compat-version 5 1.9.4))'\
     --header "DAV: http://subversion.tigris.org/xmlns/dav/svn/depth"\
     --header "DAV: http://subversion.tigris.org/xmlns/dav/svn/mergeinfo"\
     --header "DAV: http://subversion.tigris.org/xmlns/dav/svn/log-revprops"\
     --header "Content-Type: application/vnd.svn-skel"\
     'https://subversion.assembla.com/svn/delivery_notes/!svn/me'

exit

curl --basic --user $SVN_USER:$SVN_PASSWORD\
     -X OPTIONS -v\
     --data '<?xml version="1.0" encoding="utf-8"?><D:options xmlns:D="DAV:"><D:activity-collection-set></D:activity-collection-set></D:options>'\
     --header "DAV: http://subversion.tigris.org/xmlns/dav/svn/depth"\
     --header "DAV: http://subversion.tigris.org/xmlns/dav/svn/mergeinfo"\
     --header "DAV: http://subversion.tigris.org/xmlns/dav/svn/log-revprops"\
     --header "Content-Type: text/xml"\
     https://subversion.assembla.com/svn/delivery_notes/

#     --user-agent 'SVN/1.9.2 (x86_64-apple-darwin15.0.0) serf/1.3.8'\
#
