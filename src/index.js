/* global: localStorage */
const JSData = require('js-data')
const guid = require('mout/random/guid')

const {
  Query,
  utils
} = JSData

const {
  addHiddenPropsToTarget,
  copy,
  deepMixIn,
  extend,
  fillIn,
  forOwn,
  fromJson,
  get,
  isArray,
  isUndefined,
  resolve,
  reject,
  set,
  toJson
} = utils

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
function unique (array) {
  const seen = {}
  const final = []
  array.forEach(function (item) {
    if (item in seen) {
      return
    }
    final.push(item)
    seen[item] = 0
  })
  return final
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
    return reject(err)
  })
}

const noop = function (...args) {
  const self = this
  const opts = args[args.length - 1]
  self.dbg(opts.op, ...args)
  return resolve()
}

const noop2 = function (...args) {
  const self = this
  const opts = args[args.length - 2]
  self.dbg(opts.op, ...args)
  return resolve()
}

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
   * @name LocalStorageAdapter#debug
   * @type {boolean}
   * @default false
   */
  debug: false,

  /**
   * TODO
   *
   * @name LocalStorageAdapter#storage
   * @type {Object}
   * @default localStorage
   */
  storage: localStorage
}

/**
 * LocalStorageAdapter class.
 *
 * @example
 * import {DataStore} from 'js-data'
 * import LocalStorageAdapter from 'js-data-localstorage'
 * const store = new DataStore()
 * const adapter = new LocalStorageAdapter()
 * store.registerAdapter('ls', adapter, { 'default': true })
 *
 * @class LocalStorageAdapter
 * @param {Object} [opts] Configuration opts.
 * @param {string} [opts.basePath=''] TODO
 * @param {boolean} [opts.debug=false] TODO
 * @param {Object} [opts.storeage=localStorage] TODO
 */
function LocalStorageAdapter (opts) {
  fillIn(this, opts || {})
  fillIn(this, DEFAULTS)
}

/**
 * Alternative to ES6 class syntax for extending `LocalStorageAdapter`.
 *
 * @name LocalStorageAdapter.extend
 * @method
 * @param {Object} [instanceProps] Properties that will be added to the
 * prototype of the subclass.
 * @param {Object} [classProps] Properties that will be added as static
 * properties to the subclass itself.
 * @return {Object} Subclass of `LocalStorageAdapter`.
 */
LocalStorageAdapter.extend = extend

addHiddenPropsToTarget(LocalStorageAdapter.prototype, {
  /**
   * @name LocalStorageAdapter#afterCreate
   * @method
   */
  afterCreate: noop2,

  /**
   * @name LocalStorageAdapter#afterCreateMany
   * @method
   */
  afterCreateMany: noop2,

  /**
   * @name LocalStorageAdapter#afterDEL
   * @method
   */
  afterDEL: noop2,

  /**
   * @name LocalStorageAdapter#afterDestroy
   * @method
   */
  afterDestroy: noop2,

  /**
   * @name LocalStorageAdapter#afterDestroyAll
   * @method
   */
  afterDestroyAll: noop2,

  /**
   * @name LocalStorageAdapter#afterFind
   * @method
   */
  afterFind: noop2,

  /**
   * @name LocalStorageAdapter#afterFindAll
   * @method
   */
  afterFindAll: noop2,

  /**
   * @name LocalStorageAdapter#afterGET
   * @method
   */
  afterGET: noop2,

  /**
   * @name LocalStorageAdapter#afterPUT
   * @method
   */
  afterPUT: noop2,

  /**
   * @name LocalStorageAdapter#afterUpdate
   * @method
   */
  afterUpdate: noop2,

  /**
   * @name LocalStorageAdapter#afterUpdateAll
   * @method
   */
  afterUpdateAll: noop2,

  /**
   * @name LocalStorageAdapter#afterUpdateMany
   * @method
   */
  afterUpdateMany: noop2,

  /**
   * @name LocalStorageAdapter#beforeCreate
   * @method
   */
  beforeCreate: noop,

  /**
   * @name LocalStorageAdapter#beforeCreateMany
   * @method
   */
  beforeCreateMany: noop,

  /**
   * @name LocalStorageAdapter#beforeDEL
   * @method
   */
  beforeDEL: noop,

  /**
   * @name LocalStorageAdapter#beforeDestroy
   * @method
   */
  beforeDestroy: noop,

  /**
   * @name LocalStorageAdapter#beforeDestroyAll
   * @method
   */
  beforeDestroyAll: noop,

  /**
   * @name LocalStorageAdapter#beforeFind
   * @method
   */
  beforeFind: noop,

  /**
   * @name LocalStorageAdapter#beforeFindAll
   * @method
   */
  beforeFindAll: noop,

  /**
   * @name LocalStorageAdapter#beforeGET
   * @method
   */
  beforeGET: noop,

  /**
   * @name LocalStorageAdapter#beforePUT
   * @method
   */
  beforePUT: noop,

  /**
   * @name LocalStorageAdapter#beforeUpdate
   * @method
   */
  beforeUpdate: noop,

  /**
   * @name LocalStorageAdapter#beforeUpdateAll
   * @method
   */
  beforeUpdateAll: noop,

  /**
   * @name LocalStorageAdapter#beforeUpdateMany
   * @method
   */
  beforeUpdateMany: noop,

  /**
   * Create a new record.
   *
   * @name LocalStorageAdapter#create
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} props The record to be created.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] TODO
   * @return {Promise}
   */
  create (mapper, props, opts) {
    const self = this
    props || (props = {})
    opts || (opts = {})

    return createTask(function (success, failure) {
      queueTask(function () {
        let op
        // beforeCreate lifecycle hook
        op = opts.op = 'beforeCreate'
        return resolve(self[op](mapper, props, opts)).then(function (_props) {
          // Allow for re-assignment from lifecycle hook
          let record = isUndefined(_props) ? props : _props
          const id = get(record, mapper.idAttribute) || guid()
          set(record, mapper.idAttribute, id)
          const key = self.getIdPath(mapper, opts, id)

          // Create the record
          // TODO: Create related records when the "with" option is provided
          self.storage.setItem(key, toJson(record))
          self.ensureId(id, mapper, opts)

          // afterCreate lifecycle hook
          op = opts.op = 'afterCreate'
          return self[op](mapper, props, opts, record).then(function (_record) {
            // Allow for re-assignment from lifecycle hook
            record = isUndefined(_record) ? record : _record
            return opts.raw ? {
              data: record,
              created: 1
            } : record
          })
        }).then(success, failure)
      })
    })
  },

  /**
   * Create multiple records in a single batch.
   *
   * @name LocalStorageAdapter#createMany
   * @method
   * @param {Object} mapper The mapper.
   * @param {Array} props Array of records to be created.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] TODO
   * @return {Promise}
   */
  createMany (mapper, props, opts) {
    const self = this
    props || (props = {})
    opts || (opts = {})

    return createTask(function (success, failure) {
      queueTask(function () {
        let op
        // beforeCreateMany lifecycle hook
        op = opts.op = 'beforeCreateMany'
        return resolve(self[op](mapper, props, opts)).then(function (_props) {
          // Allow for re-assignment from lifecycle hook
          let records = isUndefined(_props) ? props : _props
          const idAttribute = mapper.idAttribute

          // Create the record
          // TODO: Create related records when the "with" option is provided
          records.forEach(function (record) {
            const id = get(record, idAttribute) || guid()
            set(record, idAttribute, id)
            const key = self.getIdPath(mapper, opts, id)
            self.storage.setItem(key, toJson(record))
            self.ensureId(id, mapper, opts)
          })

          // afterCreateMany lifecycle hook
          op = opts.op = 'afterCreateMany'
          return self[op](mapper, props, opts, records).then(function (_records) {
            // Allow for re-assignment from lifecycle hook
            records = isUndefined(_records) ? records : _records
            return opts.raw ? {
              data: records,
              created: records.length
            } : records
          })
        }).then(success, failure)
      })
    })
  },

  /**
   * @name LocalStorageAdapter#dbg
   * @method
   */
  dbg (...args) {
    this.log('debug', ...args)
  },

  /**
   * Destroy the record with the given primary key.
   *
   * @name LocalStorageAdapter#destroy
   * @method
   * @param {Object} mapper The mapper.
   * @param {(string|number)} id Primary key of the record to destroy.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] TODO
   * @return {Promise}
   */
  destroy (mapper, id, opts) {
    const self = this
    opts || (opts = {})

    return createTask(function (success, failure) {
      queueTask(function () {
        let op
        // beforeDestroy lifecycle hook
        op = opts.op = 'beforeDestroy'
        return resolve(self[op](mapper, id, opts)).then(function () {
          op = opts.op = 'destroy'
          self.dbg(op, id, opts)
          // Destroy the record
          // TODO: Destroy related records when the "with" option is provided
          self.storage.removeItem(self.getIdPath(mapper, opts, id))
          self.removeId(id, mapper, opts)

          // afterDestroy lifecycle hook
          op = opts.op = 'afterDestroy'
          return self[op](mapper, id, opts).then(function (_id) {
            // Allow for re-assignment from lifecycle hook
            id = isUndefined(_id) ? id : _id
            return opts.raw ? {
              data: id,
              deleted: 1
            } : id
          })
        }).then(success, failure)
      })
    })
  },

  /**
   * Destroy the records that match the selection `query`.
   *
   * @name LocalStorageAdapter#destroyAll
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} query Selection query.
   * @param {Object} [opts] Configuration opts.
   * @param {boolean} [opts.raw=false] TODO
   * @return {Promise}
   */
  destroyAll (mapper, query, opts) {
    const self = this
    query || (query = {})
    opts || (opts = {})

    return createTask(function (success, failure) {
      queueTask(function () {
        let op
        // beforeDestroyAll lifecycle hook
        op = opts.op = 'beforeDestroyAll'
        return resolve(self[op](mapper, query, opts)).then(function () {
          op = opts.op = 'destroyAll'
          self.dbg(op, query, opts)
          // Find the records that are to be destroyed
          return self.findAll(mapper, query, opts)
        }).then(function (records) {
          const idAttribute = mapper.idAttribute
          // Gather IDs of records to be destroyed
          let ids = records.map(function (record) {
            return get(record, idAttribute)
          })
          // Destroy each record
          // TODO: Destroy related records when the "with" option is provided
          ids.forEach(function (id) {
            self.storage.removeItem(self.getIdPath(mapper, opts, id))
          })
          self.removeId(ids, mapper, opts)

          // afterDestroyAll lifecycle hook
          op = opts.op = 'afterDestroyAll'
          return self[op](mapper, query, opts, ids).then(function (_ids) {
            // Allow for re-assignment from lifecycle hook
            ids = isUndefined(_ids) ? ids : _ids
            return opts.raw ? {
              data: ids,
              deleted: records.length
            } : ids
          })
        }).then(success, failure)
      })
    })
  },

  /**
   * TODO
   *
   * @name LocalStorageAdapter#ensureId
   * @method
   */
  ensureId (id, mapper, opts) {
    const ids = this.getIds(mapper, opts)
    if (isArray(id)) {
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
   * Retrieve the record with the given primary key.
   *
   * @name LocalStorageAdapter#find
   * @method
   * @param {Object} mapper The mapper.
   * @param {(string|number)} id Primary key of the record to retrieve.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] TODO
   * @param {string[]} [opts.with=[]] TODO
   * @return {Promise}
   */
  find (mapper, id, opts) {
    const self = this
    let record, op
    opts || (opts = {})
    opts.with || (opts.with = [])

    // beforeFind lifecycle hook
    op = opts.op = 'beforeFind'
    return resolve(self[op](mapper, id, opts)).then(function () {
      op = opts.op = 'find'
      self.dbg(op, id, opts)
      const key = self.getIdPath(mapper, opts, id)
      record = self.storage.getItem(key)
      if (isUndefined(record)) {
        record = undefined
        return
      }
      record = fromJson(record)
      const tasks = []
      const relationList = mapper.relationList || []

      relationList.forEach(function (def) {
        const relationName = def.relation
        const relatedMapper = def.getRelation()
        let containedName = null
        if (opts.with.indexOf(relationName) !== -1) {
          containedName = relationName
        } else if (opts.with.indexOf(def.localField) !== -1) {
          containedName = def.localField
        }
        if (!containedName) {
          return
        }
        let __opts = copy(opts)
        __opts.with = opts.with.slice()
        fillIn(__opts, relatedMapper)
        const index = __opts.with.indexOf(containedName)
        if (index >= 0) {
          __opts.with.splice(index, 1)
        }
        __opts.with.forEach(function (relation, i) {
          if (relation && relation.indexOf(containedName) === 0 && relation.length >= containedName.length && relation[containedName.length] === '.') {
            __opts.with[i] = relation.substr(containedName.length + 1)
          } else {
            __opts.with[i] = ''
          }
        })

        let task

        if ((def.type === 'hasOne' || def.type === 'hasMany') && def.foreignKey) {
          task = self.findAll(relatedMapper, {
            [def.foreignKey]: get(record, mapper.idAttribute)
          }, __opts).then(function (relatedItems) {
            if (def.type === 'hasOne' && relatedItems.length) {
              set(record, def.localField, relatedItems[0])
            } else {
              set(record, def.localField, relatedItems)
            }
            return relatedItems
          })
        } else if (def.type === 'hasMany' && def.localKeys) {
          let localKeys = []
          let itemKeys = get(record, def.localKeys) || []
          itemKeys = Array.isArray(itemKeys) ? itemKeys : Object.keys(itemKeys)
          localKeys = localKeys.concat(itemKeys || [])
          task = self.findAll(relatedMapper, {
            where: {
              [relatedMapper.idAttribute]: {
                'in': unique(localKeys).filter(function (x) { return x })
              }
            }
          }, __opts).then(function (relatedItems) {
            set(record, def.localField, relatedItems)
            return relatedItems
          })
        } else if (def.type === 'belongsTo') {
          task = self.find(relatedMapper, get(record, def.foreignKey), __opts).then(function (relatedItem) {
            set(record, def.localField, relatedItem)
            return relatedItem
          })
        }

        if (task) {
          tasks.push(task)
        }
      })

      return Promise.all(tasks)
    }).then(function () {
      // afterFind lifecycle hook
      op = opts.op = 'afterFind'
      return resolve(self[op](mapper, id, opts, record)).then(function (_record) {
        // Allow for re-assignment from lifecycle hook
        record = isUndefined(_record) ? record : _record
        return opts.raw ? {
          data: record,
          found: record ? 1 : 0
        } : record
      })
    })
  },

  /**
   * Retrieve the records that match the selection `query`.
   *
   * @name LocalStorageAdapter#findAll
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} query Selection query.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] TODO
   * @param {string[]} [opts.with=[]] TODO
   * @return {Promise}
   */
  findAll (mapper, query, opts) {
    const self = this
    let records = []
    let op
    opts || (opts = {})
    opts.with || (opts.with = [])

    // beforeFindAll lifecycle hook
    op = opts.op = 'beforeFindAll'
    return resolve(self[op](mapper, query, opts)).then(function () {
      op = opts.op = 'findAll'
      self.dbg(op, query, opts)

      // Load all records into memory...
      const ids = self.getIds(mapper, opts)
      forOwn(ids, function (value, id) {
        const json = self.storage.getItem(self.getIdPath(mapper, opts, id))
        if (json) {
          records.push(fromJson(json))
        }
      })
      const idAttribute = mapper.idAttribute
      // TODO: Verify that this collection gets properly garbage collected
      // TODO: Or, find a way to filter without using Collection
      const _query = new Query({
        index: {
          getAll () {
            return records
          }
        }
      })
      records = _query.filter(query).run()
      const tasks = []
      const relationList = mapper.relationList || []

      relationList.forEach(function (def) {
        const relationName = def.relation
        const relatedMapper = def.getRelation()
        let containedName = null
        if (opts.with.indexOf(relationName) !== -1) {
          containedName = relationName
        } else if (opts.with.indexOf(def.localField) !== -1) {
          containedName = def.localField
        }
        if (!containedName) {
          return
        }
        let __opts = copy(opts)
        __opts.with = opts.with.slice()
        fillIn(__opts, relatedMapper)
        const index = __opts.with.indexOf(containedName)
        if (index >= 0) {
          __opts.with.splice(index, 1)
        }
        __opts.with.forEach(function (relation, i) {
          if (relation && relation.indexOf(containedName) === 0 && relation.length >= containedName.length && relation[containedName.length] === '.') {
            __opts.with[i] = relation.substr(containedName.length + 1)
          } else {
            __opts.with[i] = ''
          }
        })

        let task

        if ((def.type === 'hasOne' || def.type === 'hasMany') && def.foreignKey) {
          task = self.findAll(relatedMapper, {
            where: {
              [def.foreignKey]: {
                'in': records.map(function (item) {
                  return get(item, idAttribute)
                }).filter(function (x) { return x })
              }
            }
          }, __opts).then(function (relatedItems) {
            records.forEach(function (item) {
              const attached = []
              relatedItems.forEach(function (relatedItem) {
                if (get(relatedItem, def.foreignKey) === get(item, idAttribute)) {
                  attached.push(relatedItem)
                }
              })
              if (def.type === 'hasOne' && attached.length) {
                set(item, def.localField, attached[0])
              } else {
                set(item, def.localField, attached)
              }
            })
            return relatedItems
          })
        } else if (def.type === 'hasMany' && def.localKeys) {
          let localKeys = []
          records.forEach(function (item) {
            let itemKeys = get(item, def.localKeys) || []
            itemKeys = Array.isArray(itemKeys) ? itemKeys : Object.keys(itemKeys)
            localKeys = localKeys.concat(itemKeys || [])
          })
          task = self.findAll(relatedMapper, {
            where: {
              [relatedMapper.idAttribute]: {
                'in': unique(localKeys).filter(function (x) { return x })
              }
            }
          }, __opts).then(function (relatedItems) {
            records.forEach(function (item) {
              const attached = []
              let itemKeys = get(item, def.localKeys) || []
              itemKeys = Array.isArray(itemKeys) ? itemKeys : Object.keys(itemKeys)
              relatedItems.forEach(function (relatedItem) {
                if (itemKeys && itemKeys.indexOf(relatedItem[relatedMapper.idAttribute]) !== -1) {
                  attached.push(relatedItem)
                }
              })
              set(item, def.localField, attached)
            })
            return relatedItems
          })
        } else if (def.type === 'belongsTo') {
          task = self.findAll(relatedMapper, {
            where: {
              [relatedMapper.idAttribute]: {
                'in': records.map(function (item) {
                  return get(item, def.foreignKey)
                }).filter(function (x) { return x })
              }
            }
          }, __opts).then(function (relatedItems) {
            records.forEach(function (item) {
              relatedItems.forEach(function (relatedItem) {
                if (relatedItem[relatedMapper.idAttribute] === get(item, def.foreignKey)) {
                  set(item, def.localField, relatedItem)
                }
              })
            })
            return relatedItems
          })
        }

        if (task) {
          tasks.push(task)
        }
      })
      return Promise.all(tasks)
    }).then(function () {
      // afterFindAll lifecycle hook
      op = opts.op = 'afterFindAll'
      return resolve(self[op](mapper, query, opts, records)).then(function (_records) {
        // Allow for re-assignment from lifecycle hook
        records = isUndefined(_records) ? records : _records
        return opts.raw ? {
          data: records,
          found: records.length
        } : records
      })
    })
  },

  /**
   * TODO
   *
   * @name LocalStorageAdapter#getPath
   * @method
   */
  getPath (mapper, opts) {
    opts = opts || {}
    return makePath(opts.basePath === undefined ? (mapper.basePath === undefined ? this.basePath : mapper.basePath) : opts.basePath, mapper.name)
  },

  /**
   * TODO
   *
   * @name LocalStorageAdapter#getIdPath
   * @method
   */
  getIdPath (mapper, opts, id) {
    opts = opts || {}
    return makePath(opts.basePath || this.basePath || mapper.basePath, mapper.endpoint, id)
  },

  /**
   * TODO
   *
   * @name LocalStorageAdapter#getIds
   * @method
   */
  getIds (mapper, opts) {
    let ids
    const idsPath = this.getPath(mapper, opts)
    const idsJson = this.storage.getItem(idsPath)
    if (idsJson) {
      ids = fromJson(idsJson)
    } else {
      ids = {}
    }
    return ids
  },

  /**
   * TODO
   *
   * @name LocalStorageAdapter#log
   * @method
   */
  log (level, ...args) {
    if (level && !args.length) {
      args.push(level)
      level = 'debug'
    }
    if (level === 'debug' && !this.debug) {
      return
    }
    const prefix = `${level.toUpperCase()}: (LocalStorageAdapter)`
    if (console[level]) {
      console[level](prefix, ...args)
    } else {
      console.log(prefix, ...args)
    }
  },

  /**
   * TODO
   *
   * @name LocalStorageAdapter#removeId
   * @method
   */
  removeId (id, mapper, opts) {
    const ids = this.getIds(mapper, opts)
    if (isArray(id)) {
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
   * @name LocalStorageAdapter#saveKeys
   * @method
   */
  saveKeys (ids, mapper, opts) {
    ids = ids || {}
    const idsPath = this.getPath(mapper, opts)
    if (Object.keys(ids).length) {
      this.storage.setItem(idsPath, toJson(ids))
    } else {
      this.storage.removeItem(idsPath)
    }
  },

  /**
   * Update the records that match the selection `query`. If a record with the
   * specified primary key cannot be found then no update is performed and the
   * promise is resolved with `undefined`.
   *
   * @name LocalStorageAdapter#update
   * @method
   * @param {Object} mapper The mapper.
   * @param {(string|number)} id The primary key of the record to be updated.
   * @param {Object} props The update to apply to the record.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] TODO
   * @return {Promise}
   */
  update (mapper, id, props, opts) {
    const self = this
    props || (props = {})
    opts || (opts = {})

    return createTask(function (success, failure) {
      queueTask(function () {
        let op
        // beforeUpdate lifecycle hook
        op = opts.op = 'beforeUpdate'
        return resolve(self[op](mapper, id, props, opts)).then(function (_props) {
          // Allow for re-assignment from lifecycle hook
          props = isUndefined(_props) ? props : _props
          const key = self.getIdPath(mapper, opts, id)
          let record = self.storage.getItem(key)
          record = record ? fromJson(record) : undefined
          let updated = 0

          // Update the record
          // TODO: Update related records when the "with" option is provided
          if (record) {
            deepMixIn(record, props)
            self.storage.setItem(key, toJson(record))
            updated++
          }

          // afterUpdate lifecycle hook
          op = opts.op = 'afterUpdate'
          return self[op](mapper, id, props, opts, record).then(function (_record) {
            // Allow for re-assignment from lifecycle hook
            record = isUndefined(_record) ? record : _record
            return opts.raw ? {
              data: record,
              updated
            } : record
          })
        }).then(success, failure)
      })
    })
  },

  /**
   * Update the records that match the selection `query`.
   *
   * @name LocalStorageAdapter#updateAll
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} props The update to apply to the selected records.
   * @param {Object} query Selection query.
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  updateAll (mapper, props, query, opts) {
    const self = this
    props || (props = {})
    query || (query = {})
    opts || (opts = {})

    return createTask(function (success, failure) {
      queueTask(function () {
        let op
        // beforeUpdateAll lifecycle hook
        op = opts.op = 'beforeUpdateAll'
        return resolve(self[op](mapper, props, query, opts)).then(function (_props) {
          // Allow for re-assignment from lifecycle hook
          props = isUndefined(_props) ? props : _props
          op = opts.op = 'updateAll'
          self.dbg(op, query, opts)

          // Find the records that are to be updated
          return self.findAll(mapper, query, opts)
        }).then(function (records) {
          const idAttribute = mapper.idAttribute
          let updated = 0

          // Update each record
          // TODO: Update related records when the "with" option is provided
          records.forEach(function (record) {
            record || (record = {})
            const id = get(record, idAttribute)
            const key = self.getIdPath(mapper, opts, id)
            deepMixIn(record, props)
            self.storage.setItem(key, toJson(record))
            updated++
          })

          // afterUpdateAll lifecycle hook
          op = opts.op = 'afterUpdateAll'
          return self[op](mapper, props, query, opts, records).then(function (_records) {
            // Allow for re-assignment from lifecycle hook
            records = isUndefined(_records) ? records : _records
            return opts.raw ? {
              data: records,
              updated
            } : records
          })
        }).then(success, failure)
      })
    })
  },

  /**
   * Update the given records in a single batch.
   *
   * @name LocalStorageAdapter#updateMany
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} records The records to update.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] TODO
   * @return {Promise}
   */
  updateMany (mapper, records, opts) {
    const self = this
    records || (records = [])
    opts || (opts = {})

    return createTask(function (success, failure) {
      queueTask(function () {
        let op
        let updatedRecords = []
        // beforeUpdateMany lifecycle hook
        op = opts.op = 'beforeUpdateMany'
        return resolve(self[op](mapper, records, opts)).then(function (_records) {
          // Allow for re-assignment from lifecycle hook
          records = isUndefined(_records) ? records : _records
          op = opts.op = 'updateMany'
          self.dbg(op, records, opts)

          const idAttribute = mapper.idAttribute

          // Update each record
          // TODO: Update related records when the "with" option is provided
          records.forEach(function (record) {
            if (!record) {
              return
            }
            const id = get(record, idAttribute)
            if (isUndefined(id)) {
              return
            }
            const key = self.getIdPath(mapper, opts, id)
            let json = self.storage.getItem(key)
            const existingRecord = json ? fromJson(json) : undefined
            if (!existingRecord) {
              return
            }
            deepMixIn(existingRecord, record)
            self.storage.setItem(key, toJson(existingRecord))
            updatedRecords.push(existingRecord)
          })

          // afterUpdateMany lifecycle hook
          op = opts.op = 'afterUpdateMany'
          return self[op](mapper, records, opts, updatedRecords).then(function (_records) {
            // Allow for re-assignment from lifecycle hook
            records = isUndefined(_records) ? updatedRecords : _records
            return opts.raw ? {
              data: records,
              updated: updatedRecords.length
            } : records
          })
        }).then(success, failure)
      })
    })
  }
})

/**
 * Details of the current version of the `js-data-localstorage` module.
 *
 * @name LocalStorageAdapter.version
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
LocalStorageAdapter.version = {
  full: '<%= pkg.version %>',
  major: parseInt('<%= major %>', 10),
  minor: parseInt('<%= minor %>', 10),
  patch: parseInt('<%= patch %>', 10),
  alpha: '<%= alpha %>' !== 'false' ? '<%= alpha %>' : false,
  beta: '<%= beta %>' !== 'false' ? '<%= beta %>' : false
}

/**
 * Registered as `js-data-localstorage` in NPM and Bower.
 *
 * __Script tag__:
 * ```javascript
 * window.LocalStorageAdapter
 * ```
 * __CommonJS__:
 * ```javascript
 * var LocalStorageAdapter = require('js-data-localstorage')
 * ```
 * __ES6 Modules__:
 * ```javascript
 * import LocalStorageAdapter from 'js-data-localstorage'
 * ```
 * __AMD__:
 * ```javascript
 * define('myApp', ['js-data-localstorage'], function (LocalStorageAdapter) { ... })
 * ```
 *
 * @module js-data-localstorage
 */

module.exports = LocalStorageAdapter
