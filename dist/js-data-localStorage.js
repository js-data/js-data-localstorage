/**
* @author Jason Dobry <jason.dobry@gmail.com>
* @file js-data-localStorage.js
* @version 0.1.0 - Homepage <http://www.js-data.iojs-data-localStorage/>
* @copyright (c) 2014 Jason Dobry 
* @license MIT <https://github.com/js-data/js-data-localStorage/blob/master/LICENSE>
*
* @overview My Adapter.
*/
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.DSLocalStorageAdapter=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    var isArray = Array.isArray || function (val) {
        return isKind(val, 'Array');
    };
    module.exports = isArray;


},{"./isKind":2}],2:[function(require,module,exports){
var kindOf = require('./kindOf');
    /**
     * Check if value is from a specific "kind".
     */
    function isKind(val, kind){
        return kindOf(val) === kind;
    }
    module.exports = isKind;


},{"./kindOf":3}],3:[function(require,module,exports){


    var _rKind = /^\[object (.*)\]$/,
        _toString = Object.prototype.toString,
        UNDEF;

    /**
     * Gets the "kind" of value. (e.g. "String", "Number", etc)
     */
    function kindOf(val) {
        if (val === null) {
            return 'Null';
        } else if (val === UNDEF) {
            return 'Undefined';
        } else {
            return _rKind.exec( _toString.call(val) )[1];
        }
    }
    module.exports = kindOf;


},{}],4:[function(require,module,exports){
/**
 * @constant Maximum 32-bit signed integer value. (2^31 - 1)
 */

    module.exports = 2147483647;


},{}],5:[function(require,module,exports){
/**
 * @constant Minimum 32-bit signed integer value (-2^31).
 */

    module.exports = -2147483648;


},{}],6:[function(require,module,exports){
var randInt = require('./randInt');
var isArray = require('../lang/isArray');

    /**
     * Returns a random element from the supplied arguments
     * or from the array (if single argument is an array).
     */
    function choice(items) {
        var target = (arguments.length === 1 && isArray(items))? items : arguments;
        return target[ randInt(0, target.length - 1) ];
    }

    module.exports = choice;



},{"../lang/isArray":1,"./randInt":10}],7:[function(require,module,exports){
var randHex = require('./randHex');
var choice = require('./choice');

  /**
   * Returns pseudo-random guid (UUID v4)
   * IMPORTANT: it's not totally "safe" since randHex/choice uses Math.random
   * by default and sequences can be predicted in some cases. See the
   * "random/random" documentation for more info about it and how to replace
   * the default PRNG.
   */
  function guid() {
    return (
        randHex(8)+'-'+
        randHex(4)+'-'+
        // v4 UUID always contain "4" at this position to specify it was
        // randomly generated
        '4' + randHex(3) +'-'+
        // v4 UUID always contain chars [a,b,8,9] at this position
        choice(8, 9, 'a', 'b') + randHex(3)+'-'+
        randHex(12)
    );
  }
  module.exports = guid;


},{"./choice":6,"./randHex":9}],8:[function(require,module,exports){
var random = require('./random');
var MIN_INT = require('../number/MIN_INT');
var MAX_INT = require('../number/MAX_INT');

    /**
     * Returns random number inside range
     */
    function rand(min, max){
        min = min == null? MIN_INT : min;
        max = max == null? MAX_INT : max;
        return min + (max - min) * random();
    }

    module.exports = rand;


},{"../number/MAX_INT":4,"../number/MIN_INT":5,"./random":11}],9:[function(require,module,exports){
var choice = require('./choice');

    var _chars = '0123456789abcdef'.split('');

    /**
     * Returns a random hexadecimal string
     */
    function randHex(size){
        size = size && size > 0? size : 6;
        var str = '';
        while (size--) {
            str += choice(_chars);
        }
        return str;
    }

    module.exports = randHex;



},{"./choice":6}],10:[function(require,module,exports){
var MIN_INT = require('../number/MIN_INT');
var MAX_INT = require('../number/MAX_INT');
var rand = require('./rand');

    /**
     * Gets random integer inside range or snap to min/max values.
     */
    function randInt(min, max){
        min = min == null? MIN_INT : ~~min;
        max = max == null? MAX_INT : ~~max;
        // can't be max + 0.5 otherwise it will round up if `rand`
        // returns `max` causing it to overflow range.
        // -0.5 and + 0.49 are required to avoid bias caused by rounding
        return Math.round( rand(min - 0.5, max + 0.499999999999) );
    }

    module.exports = randInt;


},{"../number/MAX_INT":4,"../number/MIN_INT":5,"./rand":8}],11:[function(require,module,exports){


    /**
     * Just a wrapper to Math.random. No methods inside mout/random should call
     * Math.random() directly so we can inject the pseudo-random number
     * generator if needed (ie. in case we need a seeded random or a better
     * algorithm than the native one)
     */
    function random(){
        return random.get();
    }

    // we expose the method so it can be swapped if needed
    random.get = Math.random;

    module.exports = random;



},{}],12:[function(require,module,exports){
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

},{"js-data":"js-data","mout/random/guid":7}]},{},[12])(12)
});