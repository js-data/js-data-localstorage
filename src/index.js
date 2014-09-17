var deepMixIn = require('mout/object/deepMixIn');
var makePath = require('mout/string/makePath');
var guid = require('mout/random/guid');
var toJson = JSON.stringify;
var P = require('es6-promise').Promise;

function Defaults() {

}

/**
 * @doc constructor
 * @id LocalStorageAdapter
 * @name LocalStorageAdapter
 * @description
 * Adapter to be used with js-data.
 */
function LocalStorageAdapter(options) {
  options = options || {};

  /**
   * @doc property
   * @id LocalStorageAdapter.properties:defaults
   * @name defaults
   * @description
   * Reference to [LocalStorageAdapter.defaults](/documentation/api/api/LocalStorageAdapter.properties:defaults).
   */
  this.defaults = new Defaults();
  deepMixIn(this.defaults, options);
}

/**
 * @doc method
 * @id LocalStorageAdapter.methods:GET
 * @name GET
 * @description
 * An asynchronous wrapper for `localStorage.getItem(key)`.
 *
 * ## Signature:
 * ```js
 * LocalStorageAdapter.GET(key)
 * ```
 *
 * @param {string} key The key path of the item to retrieve.
 * @returns {Promise} Promise.
 */
LocalStorageAdapter.prototype.GET = function (key) {
  return new P(function (resolve) {
    var item = localStorage.getItem(key);
    resolve(item ? DSUtils.fromJson(item) : undefined);
  });
};

/**
 * @doc method
 * @id LocalStorageAdapter.methods:PUT
 * @name PUT
 * @description
 * An asynchronous wrapper for `localStorage.setItem(key, value)`.
 *
 * ## Signature:
 * ```js
 * LocalStorageAdapter.PUT(key, value)
 * ```
 *
 * @param {string} key The key to update.
 * @param {object} value Attributes to put.
 * @returns {Promise} Promise.
 */
LocalStorageAdapter.prototype.PUT = function (key, value) {
  var LocalStorageAdapter = this;
  return LocalStorageAdapter.GET(key).then(function (item) {
    if (item) {
      deepMixIn(item, value);
    }
    localStorage.setItem(key, toJson(item || value));
    return LocalStorageAdapter.GET(key);
  });
};

/**
 * @doc method
 * @id LocalStorageAdapter.methods:DEL
 * @name DEL
 * @description
 * An asynchronous wrapper for `localStorage.removeItem(key)`.
 *
 * ## Signature:
 * ```js
 * LocalStorageAdapter.DEL(key)
 * ```
 *
 * @param {string} key The key to remove.
 * @returns {Promise} Promise.
 */
LocalStorageAdapter.prototype.DEL = function (key) {
  return new P(function (resolve) {
    localStorage.removeItem(key);
    resolve();
  });
};

/**
 * @doc method
 * @id LocalStorageAdapter.methods:find
 * @name find
 * @description
 * Retrieve a single entity from localStorage.
 *
 * ## Signature:
 * ```js
 * LocalStorageAdapter.find(resourceConfig, id[, options])
 * ```
 *
 * ## Example:
 * ```js
 * DS.find('user', 5, {
 *   adapter: 'LocalStorageAdapter'
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
LocalStorageAdapter.prototype.find = function find(resourceConfig, id, options) {
  options = options || {};
  return this.GET(makePath(options.baseUrl || resourceConfig.baseUrl, resourceConfig.endpoint, id));
};

/**
 * @doc method
 * @id LocalStorageAdapter.methods:findAll
 * @name findAll
 * @description
 * Not supported.
 */
LocalStorageAdapter.prototype.findAll = function () {
  throw new Error('LocalStorageAdapter.findAll is not supported!');
};

/**
 * @doc method
 * @id LocalStorageAdapter.methods:create
 * @name create
 * @description
 * Create an entity in `localStorage`. You must generate the primary key and include it in the `attrs` object.
 *
 * ## Signature:
 * ```js
 * LocalStorageAdapter.create(resourceConfig, attrs[, options])
 * ```
 *
 * ## Example:
 * ```js
 * DS.create('user', {
 *   id: 1,
 *   name: 'john'
 * }, {
 *   adapter: 'LocalStorageAdapter'
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
LocalStorageAdapter.prototype.create = function (resourceConfig, attrs, options) {
  attrs[resourceConfig.idAttribute] = attrs[resourceConfig.idAttribute] || guid();
  options = options || {};
  return this.PUT(
    makePath(options.baseUrl || resourceConfig.baseUrl, resourceConfig.getEndpoint(attrs, options), attrs[resourceConfig.idAttribute]),
    attrs
  );
};

/**
 * @doc method
 * @id LocalStorageAdapter.methods:update
 * @name update
 * @description
 * Update an entity in localStorage.
 *
 * ## Signature:
 * ```js
 * LocalStorageAdapter.update(resourceConfig, id, attrs[, options])
 * ```
 *
 * ## Example:
 * ```js
 * DS.update('user', 5, {
 *   name: 'john'
 * }, {
 *   adapter: 'LocalStorageAdapter'
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
LocalStorageAdapter.prototype.update = function (resourceConfig, id, attrs, options) {
  options = options || {};
  return this.PUT(makePath(options.baseUrl || resourceConfig.baseUrl, resourceConfig.getEndpoint(id, options), id), attrs);
};

/**
 * @doc method
 * @id LocalStorageAdapter.methods:updateAll
 * @name updateAll
 * @description
 * Not supported.
 */
LocalStorageAdapter.prototype.updateAll = function () {
  throw new Error('LocalStorageAdapter.updateAll is not supported!');
};

/**
 * @doc method
 * @id LocalStorageAdapter.methods:destroy
 * @name destroy
 * @description
 * Destroy an entity from localStorage.
 *
 * ## Signature:
 * ```js
 * LocalStorageAdapter.destroy(resourceConfig, id[, options])
 * ```
 *
 * ## Example:
 * ```js
 * DS.destroy('user', 5, {
 *   name: ''
 * }, {
 *   adapter: 'LocalStorageAdapter'
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
LocalStorageAdapter.prototype.destroy = function (resourceConfig, id, options) {
  options = options || {};
  return this.DEL(makePath(options.baseUrl || resourceConfig.baseUrl, resourceConfig.getEndpoint(id, options), id));
};

/**
 * @doc method
 * @id LocalStorageAdapter.methods:destroyAll
 * @name destroyAll
 * @description
 * Not supported.
 */
LocalStorageAdapter.prototype.destroyAll = function () {
  throw new Error('Not supported!');
};

module.exports = LocalStorageAdapter;
