var JSData;
if (!window && typeof module !== 'undefined' && module.exports) {
  JSData = require('js-data');
} else {
  JSData = window.JSData;
}

var makePath = JSData.DSUtils.makePath;
var deepMixIn = JSData.DSUtils.deepMixIn;
var guid = require('mout/random/guid');
var P = JSData.DSUtils.Promise;

function Defaults() {

}

/**
 * @doc constructor
 * @id DSLocalStorageAdapter
 * @name DSLocalStorageAdapter
 * @description
 * Adapter to be used with js-data.
 */
function DSLocalStorageAdapter(options) {
  options = options || {};

  /**
   * @doc property
   * @id DSLocalStorageAdapter.properties:defaults
   * @name defaults
   * @description
   * Reference to [DSLocalStorageAdapter.defaults](/documentation/api/api/DSLocalStorageAdapter.properties:defaults).
   */
  this.defaults = new Defaults();
  deepMixIn(this.defaults, options);
}

/**
 * @doc method
 * @id DSLocalStorageAdapter.methods:GET
 * @name GET
 * @description
 * An asynchronous wrapper for `localStorage.getItem(key)`.
 *
 * ## Signature:
 * ```js
 * DSLocalStorageAdapter.GET(key)
 * ```
 *
 * @param {string} key The key path of the item to retrieve.
 * @returns {Promise} Promise.
 */
DSLocalStorageAdapter.prototype.GET = function (key) {
  return new P(function (resolve) {
    var item = localStorage.getItem(key);
    resolve(item ? DSUtils.fromJson(item) : undefined);
  });
};

/**
 * @doc method
 * @id DSLocalStorageAdapter.methods:PUT
 * @name PUT
 * @description
 * An asynchronous wrapper for `localStorage.setItem(key, value)`.
 *
 * ## Signature:
 * ```js
 * DSLocalStorageAdapter.PUT(key, value)
 * ```
 *
 * @param {string} key The key to update.
 * @param {object} value Attributes to put.
 * @returns {Promise} Promise.
 */
DSLocalStorageAdapter.prototype.PUT = function (key, value) {
  var DSLocalStorageAdapter = this;
  return DSLocalStorageAdapter.GET(key).then(function (item) {
    if (item) {
      deepMixIn(item, value);
    }
    localStorage.setItem(key, toJson(item || value));
    return DSLocalStorageAdapter.GET(key);
  });
};

/**
 * @doc method
 * @id DSLocalStorageAdapter.methods:DEL
 * @name DEL
 * @description
 * An asynchronous wrapper for `localStorage.removeItem(key)`.
 *
 * ## Signature:
 * ```js
 * DSLocalStorageAdapter.DEL(key)
 * ```
 *
 * @param {string} key The key to remove.
 * @returns {Promise} Promise.
 */
DSLocalStorageAdapter.prototype.DEL = function (key) {
  return new P(function (resolve) {
    localStorage.removeItem(key);
    resolve();
  });
};

/**
 * @doc method
 * @id DSLocalStorageAdapter.methods:find
 * @name find
 * @description
 * Retrieve a single entity from localStorage.
 *
 * ## Signature:
 * ```js
 * DSLocalStorageAdapter.find(resourceConfig, id[, options])
 * ```
 *
 * ## Example:
 * ```js
 * DS.find('user', 5, {
 *   adapter: 'DSLocalStorageAdapter'
 * }).then(function (user) {
 *   user; // { id: 5, ... }
 * });
 * ```
 *
 * @param {object} resourceConfig DS resource definition object:
 * @param {string|number} id Primary key of the entity to retrieve.
 * @param {object=} options Optional configuration. Properties:
 *
 * - `{string=}` - `baseUrl` - Base path to use.
 *
 * @returns {Promise} Promise.
 */
DSLocalStorageAdapter.prototype.find = function find(resourceConfig, id, options) {
  options = options || {};
  return this.GET(makePath(options.baseUrl || resourceConfig.baseUrl, resourceConfig.endpoint, id));
};

/**
 * @doc method
 * @id DSLocalStorageAdapter.methods:findAll
 * @name findAll
 * @description
 * Not supported.
 */
DSLocalStorageAdapter.prototype.findAll = function () {
  throw new Error('DSLocalStorageAdapter.findAll is not supported!');
};

/**
 * @doc method
 * @id DSLocalStorageAdapter.methods:create
 * @name create
 * @description
 * Create an entity in `localStorage`. You must generate the primary key and include it in the `attrs` object.
 *
 * ## Signature:
 * ```js
 * DSLocalStorageAdapter.create(resourceConfig, attrs[, options])
 * ```
 *
 * ## Example:
 * ```js
 * DS.create('user', {
 *   id: 1,
 *   name: 'john'
 * }, {
 *   adapter: 'DSLocalStorageAdapter'
 * }).then(function (user) {
 *   user; // { id: 1, name: 'john' }
 * });
 * ```
 *
 * @param {object} resourceConfig DS resource definition object:
 * @param {object} attrs Attributes to create in localStorage.
 * @param {object=} options Optional configuration. Properties:
 *
 * - `{string=}` - `baseUrl` - Base path to use.
 *
 * @returns {Promise} Promise.
 */
DSLocalStorageAdapter.prototype.create = function (resourceConfig, attrs, options) {
  attrs[resourceConfig.idAttribute] = attrs[resourceConfig.idAttribute] || guid();
  options = options || {};
  return this.PUT(
    makePath(options.baseUrl || resourceConfig.baseUrl, resourceConfig.getEndpoint(attrs, options), attrs[resourceConfig.idAttribute]),
    attrs
  );
};

/**
 * @doc method
 * @id DSLocalStorageAdapter.methods:update
 * @name update
 * @description
 * Update an entity in localStorage.
 *
 * ## Signature:
 * ```js
 * DSLocalStorageAdapter.update(resourceConfig, id, attrs[, options])
 * ```
 *
 * ## Example:
 * ```js
 * DS.update('user', 5, {
 *   name: 'john'
 * }, {
 *   adapter: 'DSLocalStorageAdapter'
 * }).then(function (user) {
 *   user; // { id: 5, ... }
 * });
 * ```
 *
 * @param {object} resourceConfig DS resource definition object:
 * @param {string|number} id Primary key of the entity to retrieve.
 * @param {object} attrs Attributes with which to update the entity.
 * @param {object=} options Optional configuration. Properties:
 *
 * - `{string=}` - `baseUrl` - Base path to use.
 *
 * @returns {Promise} Promise.
 */
DSLocalStorageAdapter.prototype.update = function (resourceConfig, id, attrs, options) {
  options = options || {};
  return this.PUT(makePath(options.baseUrl || resourceConfig.baseUrl, resourceConfig.getEndpoint(id, options), id), attrs);
};

/**
 * @doc method
 * @id DSLocalStorageAdapter.methods:updateAll
 * @name updateAll
 * @description
 * Not supported.
 */
DSLocalStorageAdapter.prototype.updateAll = function () {
  throw new Error('DSLocalStorageAdapter.updateAll is not supported!');
};

/**
 * @doc method
 * @id DSLocalStorageAdapter.methods:destroy
 * @name destroy
 * @description
 * Destroy an entity from localStorage.
 *
 * ## Signature:
 * ```js
 * DSLocalStorageAdapter.destroy(resourceConfig, id[, options])
 * ```
 *
 * ## Example:
 * ```js
 * DS.destroy('user', 5, {
 *   name: ''
 * }, {
 *   adapter: 'DSLocalStorageAdapter'
 * }).then(function (user) {
 *   user; // { id: 5, ... }
 * });
 * ```
 *
 * @param {object} resourceConfig DS resource definition object:
 * @param {string|number} id Primary key of the entity to destroy.
 * @param {object=} options Optional configuration. Properties:
 *
 * - `{string=}` - `baseUrl` - Base path to use.
 *
 * @returns {Promise} Promise.
 */
DSLocalStorageAdapter.prototype.destroy = function (resourceConfig, id, options) {
  options = options || {};
  return this.DEL(makePath(options.baseUrl || resourceConfig.baseUrl, resourceConfig.getEndpoint(id, options), id));
};

/**
 * @doc method
 * @id DSLocalStorageAdapter.methods:destroyAll
 * @name destroyAll
 * @description
 * Not supported.
 */
DSLocalStorageAdapter.prototype.destroyAll = function () {
  throw new Error('Not supported!');
};

module.exports = DSLocalStorageAdapter;
