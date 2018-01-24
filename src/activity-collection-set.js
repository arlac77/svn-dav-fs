/**
 * @param {URL} url
 * @param {Map<string,Object>} attributes
 * @param {Set<string>} davFeatures
 * @param {Set<string>} allowedMethods
 *
 * @property {URL} url
 * @property {Map<string,Object>} attributes
 * @property {Set<string>} davFeatures
 * @property {Set<string>} allowedMethods
 */
export class ActivityCollectionSet {
  constructor(url, attributes, davFeatures, allowedMethods) {
    Object.defineProperties(this, {
      url: { value: url },
      attributes: { value: attributes },
      davFeatures: { value: davFeatures },
      allowedMethods: { value: allowedMethods }
    });
  }

  get repositoryRoot() {
    return this.attributes.get('SVN-Repository-Root');
  }

  get absoluteRepositoryRoot() {
    return this.url.origin + this.repositoryRoot;
  }

  /**
   * @return {string} path of the url inside of the repository
   */
  get pathInsideRepository() {
    return this.url.pathname.substring(this.repositoryRoot.length);
  }
}
