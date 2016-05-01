/* global: localStorage */

import {Query, utils} from 'js-data'
import {Adapter} from '../node_modules/js-data-adapter/src/index'

// This is kinda weird, but it's so we can use Rollup.js
import * as Guid from '../node_modules/mout/random/guid'
const { default: guid } = Guid

const __super__ = Adapter.prototype

const DEFAULTS = {
  /**
   * TODO
   *
   * @name LocalStorageAdapter#basePath
   * @type {string}
   */
  basePath: '',

  /**
   * TODO
   *
   * @name LocalStorageAdapter#storage
   * @type {Object}
   * @default localStorage
   */
  storage: localStorage
}

function isValidString (value) {
  return (value != null && value !== '')
}
function join (items, separator) {
  separator || (separator = '')
  return items.filter(isValidString).join(separator)
}
function makePath (...args) {
  let result = join(args, '/')
  return result.replace(/([^:\/]|^)\/{2,}/g, '$1/')
}
let queue = []
let taskInProcess = false

function enqueue (task) {
  queue.push(task)
}

function dequeue () {
  if (queue.length && !taskInProcess) {
    taskInProcess = true
    queue[0]()
  }
}

function queueTask (task) {
  if (!queue.length) {
    enqueue(task)
    dequeue()
  } else {
    enqueue(task)
  }
}

function createTask (fn) {
  return new Promise(fn).then(function (result) {
    taskInProcess = false
    queue.shift()
    setTimeout(dequeue, 0)
    return result
  }, function (err) {
    taskInProcess = false
    queue.shift()
    setTimeout(dequeue, 0)
    return utils.reject(err)
  })
}

/**
 * {@link LocalStorageAdapter} class.
 *
 * @name module:js-data-localstorage.LocalStorageAdapter
 * @see LocalStorageAdapter
 */

/**
 * {@link LocalStorageAdapter} class. ES2015 default import.
 *
 * @name module:js-data-localstorage.default
 * @see LocalStorageAdapter
 */

/**
 * LocalStorageAdapter class.
 *
 * @example
 * import {DataStore} from 'js-data'
 * import {LocalStorageAdapter} from 'js-data-localstorage'
 * const store = new DataStore()
 * const adapter = new LocalStorageAdapter()
 * store.registerAdapter('ls', adapter, { 'default': true })
 *
 * @class LocalStorageAdapter
 * @alias LocalStorageAdapter
 * @extends Adapter
 * @param {Object} [opts] Configuration options.
 * @param {string} [opts.basePath=''] See {@link LocalStorageAdapter#basePath}.
 * @param {boolean} [opts.debug=false] See {@link Adapter#debug}.
 * @param {boolean} [opts.raw=false] See {@link Adapter#raw}.
 * @param {Object} [opts.storeage=localStorage] See {@link LocalStorageAdapter#storage}.
 */
export function LocalStorageAdapter (opts) {
  const self = this
  utils.classCallCheck(self, LocalStorageAdapter)
  opts || (opts = {})
  utils.fillIn(opts, DEFAULTS)
  Adapter.call(self, opts)
}

// Setup prototype inheritance from Adapter
LocalStorageAdapter.prototype = Object.create(Adapter.prototype, {
  constructor: {
    value: LocalStorageAdapter,
    enumerable: false,
    writable: true,
    configurable: true
  }
})

Object.defineProperty(LocalStorageAdapter, '__super__', {
  configurable: true,
  value: Adapter
})

/**
 * Alternative to ES6 class syntax for extending `LocalStorageAdapter`.
 *
 * @example <caption>Using the ES2015 class syntax.</caption>
 * class MyLocalStorageAdapter extends LocalStorageAdapter {...}
 * const adapter = new MyLocalStorageAdapter()
 *
 * @example <caption>Using {@link LocalStorageAdapter.extend}.</caption>
 * var instanceProps = {...}
 * var classProps = {...}
 *
 * var MyLocalStorageAdapter = LocalStorageAdapter.extend(instanceProps, classProps)
 * var adapter = new MyLocalStorageAdapter()
 *
 * @method LocalStorageAdapter.extend
 * @static
 * @param {Object} [instanceProps] Properties that will be added to the
 * prototype of the subclass.
 * @param {Object} [classProps] Properties that will be added as static
 * properties to the subclass itself.
 * @return {Constructor} Subclass of `LocalStorageAdapter`.
 */
LocalStorageAdapter.extend = utils.extend

utils.addHiddenPropsToTarget(LocalStorageAdapter.prototype, {
  /**
   * Retrieve the number of records that match the selection query. Internal
   * method used by Adapter#count.
   *
   * @method LocalStorageAdapter#_count
   * @private
   * @param {Object} mapper The mapper.
   * @param {Object} query Selection query.
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  _count (mapper, query, opts) {
    const self = this
    return self._findAll(mapper, query, opts).then(function (result) {
      result[0] = result[0].length
      return result
    })
  },

  _createHelper (mapper, props, opts) {
    const self = this
    const _props = {}
    const relationFields = mapper.relationFields || []
    utils.forOwn(props, function (value, key) {
      if (relationFields.indexOf(key) === -1) {
        _props[key] = value
      }
    })
    const id = utils.get(_props, mapper.idAttribute) || guid()
    utils.set(_props, mapper.idAttribute, id)
    const key = self.getIdPath(mapper, opts, id)

    // Create the record
    // TODO: Create related records when the "with" option is provided
    self.storage.setItem(key, utils.toJson(_props))
    self.ensureId(id, mapper, opts)
    return utils.fromJson(self.storage.getItem(key))
  },

  /**
   * Create a new record. Internal method used by Adapter#create.
   *
   * @method LocalStorageAdapter#_create
   * @private
   * @param {Object} mapper The mapper.
   * @param {Object} props The record to be created.
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  _create (mapper, props, opts) {
    const self = this
    return new Promise(function (resolve) {
      return resolve([self._createHelper(mapper, props, opts), {}])
    })
  },

  /**
   * Create multiple records in a single batch. Internal method used by
   * Adapter#createMany.
   *
   * @method LocalStorageAdapter#_createMany
   * @private
   * @param {Object} mapper The mapper.
   * @param {Object} props The records to be created.
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  _createMany (mapper, props, opts) {
    const self = this
    return new Promise(function (resolve) {
      props || (props = [])
      return resolve([props.map(function (_props) {
        return self._createHelper(mapper, _props, opts)
      }), {}])
    })
  },

  /**
   * Destroy the record with the given primary key. Internal method used by
   * Adapter#destroy.
   *
   * @method LocalStorageAdapter#_destroy
   * @private
   * @param {Object} mapper The mapper.
   * @param {(string|number)} id Primary key of the record to destroy.
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  _destroy (mapper, id, opts) {
    const self = this
    return new Promise(function (resolve) {
      self.storage.removeItem(self.getIdPath(mapper, opts, id))
      self.removeId(id, mapper, opts)
      return resolve([undefined, {}])
    })
  },

  /**
   * Destroy the records that match the selection query. Internal method used by
   * Adapter#destroyAll.
   *
   * @method LocalStorageAdapter#_destroyAll
   * @private
   * @param {Object} mapper the mapper.
   * @param {Object} [query] Selection query.
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  _destroyAll (mapper, query, opts) {
    const self = this
    return self._findAll(mapper, query).then(function (results) {
      let [records] = results
      const idAttribute = mapper.idAttribute
      // Gather IDs of records to be destroyed
      const ids = records.map(function (record) {
        return utils.get(record, idAttribute)
      })
      // Destroy each record
      ids.forEach(function (id) {
        self.storage.removeItem(self.getIdPath(mapper, opts, id))
      })
      self.removeId(ids, mapper, opts)
      return [undefined, {}]
    })
  },

  /**
   * Retrieve the record with the given primary key. Internal method used by
   * Adapter#find.
   *
   * @method LocalStorageAdapter#_find
   * @private
   * @param {Object} mapper The mapper.
   * @param {(string|number)} id Primary key of the record to retrieve.
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  _find (mapper, id, opts) {
    const self = this
    return new Promise(function (resolve) {
      const key = self.getIdPath(mapper, opts, id)
      const record = self.storage.getItem(key)
      return resolve([record ? utils.fromJson(record) : undefined, {}])
    })
  },

  /**
   * Retrieve the records that match the selection query. Internal method used
   * by Adapter#findAll.
   *
   * @method LocalStorageAdapter#_findAll
   * @private
   * @param {Object} mapper The mapper.
   * @param {Object} query Selection query.
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  _findAll (mapper, query, opts) {
    const self = this
    query || (query = {})
    return new Promise(function (resolve) {
      // Load all records into memory...
      let records = []
      const ids = self.getIds(mapper, opts)
      utils.forOwn(ids, function (value, id) {
        const json = self.storage.getItem(self.getIdPath(mapper, opts, id))
        if (json) {
          records.push(utils.fromJson(json))
        }
      })
      const _query = new Query({
        index: {
          getAll () {
            return records
          }
        }
      })
      return resolve([_query.filter(query).run(), {}])
    })
  },

  /**
   * Retrieve the number of records that match the selection query. Internal
   * method used by Adapter#sum.
   *
   * @method LocalStorageAdapter#_sum
   * @private
   * @param {Object} mapper The mapper.
   * @param {string} field The field to sum.
   * @param {Object} query Selection query.
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  _sum (mapper, field, query, opts) {
    const self = this
    return self._findAll(mapper, query, opts).then(function (result) {
      let sum = 0
      result[0].forEach(function (record) {
        sum += utils.get(record, field) || 0
      })
      result[0] = sum
      return result
    })
  },

  /**
   * Apply the given update to the record with the specified primary key.
   * Internal method used by Adapter#update.
   *
   * @method LocalStorageAdapter#_update
   * @private
   * @param {Object} mapper The mapper.
   * @param {(string|number)} id The primary key of the record to be updated.
   * @param {Object} props The update to apply to the record.
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  _update (mapper, id, props, opts) {
    const self = this
    props || (props = {})
    return new Promise(function (resolve, reject) {
      const key = self.getIdPath(mapper, opts, id)
      let record = self.storage.getItem(key)
      if (!record) {
        return reject(new Error('Not Found'))
      }
      record = utils.fromJson(record)
      utils.deepMixIn(record, props)
      self.storage.setItem(key, utils.toJson(record))
      return resolve([record, {}])
    })
  },

  /**
   * Apply the given update to all records that match the selection query.
   * Internal method used by Adapter#updateAll.
   *
   * @method LocalStorageAdapter#_updateAll
   * @private
   * @param {Object} mapper The mapper.
   * @param {Object} props The update to apply to the selected records.
   * @param {Object} [query] Selection query.
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  _updateAll (mapper, props, query, opts) {
    const self = this
    const idAttribute = mapper.idAttribute
    return self._findAll(mapper, query, opts).then(function (results) {
      let [records] = results
      records.forEach(function (record) {
        record || (record = {})
        const id = utils.get(record, idAttribute)
        const key = self.getIdPath(mapper, opts, id)
        utils.deepMixIn(record, props)
        self.storage.setItem(key, utils.toJson(record))
      })
      return [records, {}]
    })
  },

  /**
   * Update the given records in a single batch. Internal method used by
   * Adapter#updateMany.
   *
   * @method LocalStorageAdapter#updateMany
   * @private
   * @param {Object} mapper The mapper.
   * @param {Object[]} records The records to update.
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  _updateMany (mapper, records, opts) {
    const self = this
    records || (records = [])
    return new Promise(function (resolve) {
      const updatedRecords = []
      const idAttribute = mapper.idAttribute
      records.forEach(function (record) {
        if (!record) {
          return
        }
        const id = utils.get(record, idAttribute)
        if (utils.isUndefined(id)) {
          return
        }
        const key = self.getIdPath(mapper, opts, id)
        let json = self.storage.getItem(key)
        if (!json) {
          return
        }
        const existingRecord = utils.fromJson(json)
        utils.deepMixIn(existingRecord, record)
        self.storage.setItem(key, utils.toJson(existingRecord))
        updatedRecords.push(existingRecord)
      })
      return resolve([records, {}])
    })
  },

  create (mapper, props, opts) {
    const self = this
    return createTask(function (success, failure) {
      queueTask(function () {
        __super__.create.call(self, mapper, props, opts).then(success, failure)
      })
    })
  },

  createMany (mapper, props, opts) {
    const self = this
    return createTask(function (success, failure) {
      queueTask(function () {
        __super__.createMany.call(self, mapper, props, opts).then(success, failure)
      })
    })
  },

  destroy (mapper, id, opts) {
    const self = this
    return createTask(function (success, failure) {
      queueTask(function () {
        __super__.destroy.call(self, mapper, id, opts).then(success, failure)
      })
    })
  },

  destroyAll (mapper, query, opts) {
    const self = this
    return createTask(function (success, failure) {
      queueTask(function () {
        __super__.destroyAll.call(self, mapper, query, opts).then(success, failure)
      })
    })
  },

  /**
   * TODO
   *
   * @method LocalStorageAdapter#ensureId
   */
  ensureId (id, mapper, opts) {
    const ids = this.getIds(mapper, opts)
    if (utils.isArray(id)) {
      if (!id.length) {
        return
      }
      id.forEach(function (_id) {
        ids[_id] = 1
      })
    } else {
      ids[id] = 1
    }
    this.saveKeys(ids, mapper, opts)
  },

  /**
   * TODO
   *
   * @method LocalStorageAdapter#getPath
   */
  getPath (mapper, opts) {
    opts = opts || {}
    return makePath(opts.basePath === undefined ? (mapper.basePath === undefined ? this.basePath : mapper.basePath) : opts.basePath, mapper.name)
  },

  /**
   * TODO
   *
   * @method LocalStorageAdapter#getIdPath
   */
  getIdPath (mapper, opts, id) {
    opts = opts || {}
    return makePath(opts.basePath || this.basePath || mapper.basePath, mapper.endpoint, id)
  },

  /**
   * TODO
   *
   * @method LocalStorageAdapter#getIds
   */
  getIds (mapper, opts) {
    let ids
    const idsPath = this.getPath(mapper, opts)
    const idsJson = this.storage.getItem(idsPath)
    if (idsJson) {
      ids = utils.fromJson(idsJson)
    } else {
      ids = {}
    }
    return ids
  },

  /**
   * TODO
   *
   * @method LocalStorageAdapter#removeId
   */
  removeId (id, mapper, opts) {
    const ids = this.getIds(mapper, opts)
    if (utils.isArray(id)) {
      if (!id.length) {
        return
      }
      id.forEach(function (_id) {
        delete ids[_id]
      })
    } else {
      delete ids[id]
    }
    this.saveKeys(ids, mapper, opts)
  },

  /**
   * TODO
   *
   * @method LocalStorageAdapter#saveKeys
   */
  saveKeys (ids, mapper, opts) {
    ids = ids || {}
    const idsPath = this.getPath(mapper, opts)
    if (Object.keys(ids).length) {
      this.storage.setItem(idsPath, utils.toJson(ids))
    } else {
      this.storage.removeItem(idsPath)
    }
  },

  update (mapper, id, props, opts) {
    const self = this
    return createTask(function (success, failure) {
      queueTask(function () {
        __super__.update.call(self, mapper, id, props, opts).then(success, failure)
      })
    })
  },

  updateAll (mapper, props, query, opts) {
    const self = this
    return createTask(function (success, failure) {
      queueTask(function () {
        __super__.updateAll.call(self, mapper, props, query, opts).then(success, failure)
      })
    })
  },

  updateMany (mapper, records, opts) {
    const self = this
    return createTask(function (success, failure) {
      queueTask(function () {
        __super__.updateMany.call(self, mapper, records, opts).then(success, failure)
      })
    })
  }
})

/**
 * Details of the current version of the `js-data-localstorage` module.
 *
 * @name module:js-data-localstorage.version
 * @type {Object}
 * @property {string} version.full The full semver value.
 * @property {number} version.major The major version number.
 * @property {number} version.minor The minor version number.
 * @property {number} version.patch The patch version number.
 * @property {(string|boolean)} version.alpha The alpha version value,
 * otherwise `false` if the current version is not alpha.
 * @property {(string|boolean)} version.beta The beta version value,
 * otherwise `false` if the current version is not beta.
 */
export const version = '<%= version %>'

/**
 * Registered as `js-data-localstorage` in NPM and Bower.
 *
 * @example <caption>Script tag</caption>
 * var LocalStorageAdapter = window.JSDataLocalStorage.LocalStorageAdapter
 * var adapter = new LocalStorageAdapter()
 *
 * @example <caption>CommonJS</caption>
 * var LocalStorageAdapter = require('js-data-localstorage').LocalStorageAdapter
 * var adapter = new LocalStorageAdapter()
 *
 * @example <caption>ES2015 Modules</caption>
 * import {LocalStorageAdapter} from 'js-data-localstorage'
 * const adapter = new LocalStorageAdapter()
 *
 * @example <caption>AMD</caption>
 * define('myApp', ['js-data-localstorage'], function (JSDataLocalStorage) {
 *   var LocalStorageAdapter = JSDataLocalStorage.LocalStorageAdapter
 *   var adapter = new LocalStorageAdapter()
 *
 *   // ...
 * })
 *
 * @module js-data-localstorage
 */

export default LocalStorageAdapter
