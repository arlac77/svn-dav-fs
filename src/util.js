/**
 * <!-- skip-example -->
 * Encodes objects into strings as used by svn
 * @example
 * (create-txn-with-props
 *    (svn:txn-user-agent 48 SVN/1.9.4 (x86_64-apple-darwin15.0.0) serf/1.3.8
 *     svn:log 19 this is the message
 *     svn:txn-client-compat-version 5 1.9.4))
 * @param {Object} object to be encoded
 * @return {string} encoded object value
 */
export function encodeProperties(object) {
  return (
    '(' +
    Object.keys(object)
      .map(k => {
        const v = object[k];

        if (typeof v === 'string' || v instanceof String) {
          return `${k} ${v.length} ${v}`;
        }

        return `${k} ${encodeProperties(v)}`;
      })
      .join(' ') +
    ')'
  );
}

export function headerIntoSet(header, target) {
  if (header) {
    header.split(/\s*,\s*/).forEach(e => target.add(e));
  }
}
