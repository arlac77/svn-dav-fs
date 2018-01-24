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
    Object.defineProperty(this, 'url', { value: url });
    Object.defineProperty(this, 'attributes', { value: attributes });
    Object.defineProperty(this, 'davFeatures', { value: davFeatures });
    Object.defineProperty(this, 'allowedMethods', { value: allowedMethods });
  }

  get repositoryRoot() {
    return this.attributes.get('SVN-Repository-Root');
  }

  get absoluteRepositoryRoot() {
    return this.url.origin + this.attributes.get('SVN-Repository-Root');
  }
}
