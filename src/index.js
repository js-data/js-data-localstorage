/* global: localStorage */
let JSData = require('js-data')
let guid = require('mout/random/guid')
let unique = require('mout/array/unique')
let map = require('mout/array/map')

let emptyStore = new JSData.DS()
let {DSUtils} = JSData
let filter = emptyStore.defaults.defaultFilter

class Defaults {

}

Defaults.prototype.basePath = ''

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
  return new DSUtils.Promise(fn).then(result => {
    taskInProcess = false
    queue.shift()
    setTimeout(dequeue, 0)
    return result
  }, err => {
    taskInProcess = false
    queue.shift()
    setTimeout(dequeue, 0)
    return DSUtils.Promise.reject(err)
  })
}

class DSLocalStorageAdapter {
  constructor (options) {
    options = options || {}
    this.defaults = new Defaults()
    this.storage = options.storage || localStorage
    DSUtils.deepMixIn(this.defaults, options)
  }

  getPath (resourceConfig, options) {
    options = options || {}
    return DSUtils.makePath(options.basePath || this.defaults.basePath || resourceConfig.basePath, resourceConfig.name)
  }

  getIdPath (resourceConfig, options, id) {
    options = options || {}
    return DSUtils.makePath(options.basePath || this.defaults.basePath || resourceConfig.basePath, resourceConfig.endpoint, id)
  }

  getIds (resourceConfig, options) {
    let ids
    const idsPath = this.getPath(resourceConfig, options)
    const idsJson = this.storage.getItem(idsPath)
    if (idsJson) {
      ids = DSUtils.fromJson(idsJson)
    } else {
      this.storage.setItem(idsPath, DSUtils.toJson({}))
      ids = {}
    }
    return ids
  }

  saveKeys (ids, resourceConfig, options) {
    this.storage.setItem(this.getPath(resourceConfig, options), DSUtils.toJson(ids))
  }

  ensureId (id, resourceConfig, options) {
    const ids = this.getIds(resourceConfig, options)
    if (DSUtils.isArray(id)) {
      if (!id.length) {
        return
      }
      DSUtils.forEach(id, function (_id) {
        ids[_id] = 1
      })
    } else {
      ids[id] = 1
    }
    this.saveKeys(ids, resourceConfig, options)
  }

  removeId (id, resourceConfig, options) {
    const ids = this.getIds(resourceConfig, options)
    if (DSUtils.isArray(id)) {
      if (!id.length) {
        return
      }
      DSUtils.forEach(id, function (_id) {
        delete ids[_id]
      })
    } else {
      delete ids[id]
    }
    this.saveKeys(ids, resourceConfig, options)
  }

  GET (key) {
    return new DSUtils.Promise(resolve => {
      let item = this.storage.getItem(key)
      resolve(item ? DSUtils.fromJson(item) : undefined)
    })
  }

  PUT (key, value) {
    let DSLocalStorageAdapter = this
    return DSLocalStorageAdapter.GET(key).then(item => {
      if (item) {
        DSUtils.deepMixIn(item, DSUtils.removeCircular(value))
      }
      this.storage.setItem(key, DSUtils.toJson(item || value))
      return DSLocalStorageAdapter.GET(key)
    })
  }

  DEL (key) {
    return new DSUtils.Promise(resolve => {
      this.storage.removeItem(key)
      resolve()
    })
  }

  find (resourceConfig, id, options) {
    let instance
    options = options || {}
    options.with = options.with || []
    return new DSUtils.Promise((resolve, reject) => {
      this.GET(this.getIdPath(resourceConfig, options || {}, id))
        .then(item => !item ? reject(new Error('Not Found!')) : item)
        .then(_instance => {
          instance = _instance
          let tasks = []

          DSUtils.forEach(resourceConfig.relationList, def => {
            let relationName = def.relation
            let relationDef = resourceConfig.getResource(relationName)
            let containedName = null
            if (DSUtils.contains(options.with, relationName)) {
              containedName = relationName
            } else if (DSUtils.contains(options.with, def.localField)) {
              containedName = def.localField
            }
            if (containedName) {
              let __options = DSUtils.deepMixIn({}, options.orig ? options.orig() : options)
              __options.with = options.with.slice()
              __options = DSUtils._(relationDef, __options)
              DSUtils.remove(__options.with, containedName)
              DSUtils.forEach(__options.with, (relation, i) => {
                if (relation && relation.indexOf(containedName) === 0 && relation.length >= containedName.length && relation[containedName.length] === '.') {
                  __options.with[i] = relation.substr(containedName.length + 1)
                } else {
                  __options.with[i] = ''
                }
              })

              let task

              if ((def.type === 'hasOne' || def.type === 'hasMany') && def.foreignKey) {
                task = this.findAll(resourceConfig.getResource(relationName), {
                  where: {
                    [def.foreignKey]: {
                      '==': instance[resourceConfig.idAttribute]
                    }
                  }
                }, __options).then(relatedItems => {
                  if (def.type === 'hasOne' && relatedItems.length) {
                    DSUtils.set(instance, def.localField, relatedItems[0])
                  } else {
                    DSUtils.set(instance, def.localField, relatedItems)
                  }
                  return relatedItems
                })
              } else if (def.type === 'hasMany' && def.localKeys) {
                let localKeys = []
                let itemKeys = instance[def.localKeys] || []
                itemKeys = Array.isArray(itemKeys) ? itemKeys : DSUtils.keys(itemKeys)
                localKeys = localKeys.concat(itemKeys || [])
                task = this.findAll(resourceConfig.getResource(relationName), {
                  where: {
                    [relationDef.idAttribute]: {
                      'in': DSUtils.filter(unique(localKeys), x => x)
                    }
                  }
                }, __options).then(relatedItems => {
                  DSUtils.set(instance, def.localField, relatedItems)
                  return relatedItems
                })
              } else if (def.type === 'belongsTo' || (def.type === 'hasOne' && def.localKey)) {
                task = this.find(resourceConfig.getResource(relationName), DSUtils.get(instance, def.localKey), __options).then(relatedItem => {
                  DSUtils.set(instance, def.localField, relatedItem)
                  return relatedItem
                })
              }

              if (task) {
                tasks.push(task)
              }
            }
          })

          return DSUtils.Promise.all(tasks)
        })
        .then(() => resolve(instance))
        .catch(reject)
    })
  }

  findAll (resourceConfig, params, options) {
    let items = null
    options = options || {}
    options.with = options.with || []
    return new DSUtils.Promise((resolve, reject) => {
      try {
        options = options || {}
        if (!('allowSimpleWhere' in options)) {
          options.allowSimpleWhere = true
        }
        let items = []
        let ids = DSUtils.keys(this.getIds(resourceConfig, options))
        DSUtils.forEach(ids, id => {
          let itemJson = this.storage.getItem(this.getIdPath(resourceConfig, options, id))
          if (itemJson) {
            items.push(DSUtils.fromJson(itemJson))
          }
        })
        resolve(filter.call(emptyStore, items, resourceConfig.name, params, options))
      } catch (err) {
        reject(err)
      }
    }).then(_items => {
      items = _items
      let tasks = []
      DSUtils.forEach(resourceConfig.relationList, def => {
        let relationName = def.relation
        let relationDef = resourceConfig.getResource(relationName)
        let containedName = null
        if (DSUtils.contains(options.with, relationName)) {
          containedName = relationName
        } else if (DSUtils.contains(options.with, def.localField)) {
          containedName = def.localField
        }
        if (containedName) {
          let __options = DSUtils.deepMixIn({}, options.orig ? options.orig() : options)
          __options.with = options.with.slice()
          __options = DSUtils._(relationDef, __options)
          DSUtils.remove(__options.with, containedName)
          DSUtils.forEach(__options.with, (relation, i) => {
            if (relation && relation.indexOf(containedName) === 0 && relation.length >= containedName.length && relation[containedName.length] === '.') {
              __options.with[i] = relation.substr(containedName.length + 1)
            } else {
              __options.with[i] = ''
            }
          })

          let task

          if ((def.type === 'hasOne' || def.type === 'hasMany') && def.foreignKey) {
            task = this.findAll(resourceConfig.getResource(relationName), {
              where: {
                [def.foreignKey]: {
                  'in': DSUtils.filter(map(items, item => DSUtils.get(item, resourceConfig.idAttribute)), x => x)
                }
              }
            }, __options).then(relatedItems => {
              DSUtils.forEach(items, item => {
                let attached = []
                DSUtils.forEach(relatedItems, relatedItem => {
                  if (DSUtils.get(relatedItem, def.foreignKey) === item[resourceConfig.idAttribute]) {
                    attached.push(relatedItem)
                  }
                })
                if (def.type === 'hasOne' && attached.length) {
                  DSUtils.set(item, def.localField, attached[0])
                } else {
                  DSUtils.set(item, def.localField, attached)
                }
              })
              return relatedItems
            })
          } else if (def.type === 'hasMany' && def.localKeys) {
            let localKeys = []
            DSUtils.forEach(items, item => {
              let itemKeys = item[def.localKeys] || []
              itemKeys = Array.isArray(itemKeys) ? itemKeys : DSUtils.keys(itemKeys)
              localKeys = localKeys.concat(itemKeys || [])
            })
            task = this.findAll(resourceConfig.getResource(relationName), {
              where: {
                [relationDef.idAttribute]: {
                  'in': DSUtils.filter(unique(localKeys), x => x)
                }
              }
            }, __options).then(relatedItems => {
              DSUtils.forEach(items, item => {
                let attached = []
                let itemKeys = item[def.localKeys] || []
                itemKeys = Array.isArray(itemKeys) ? itemKeys : DSUtils.keys(itemKeys)
                DSUtils.forEach(relatedItems, relatedItem => {
                  if (itemKeys && DSUtils.contains(itemKeys, relatedItem[relationDef.idAttribute])) {
                    attached.push(relatedItem)
                  }
                })
                DSUtils.set(item, def.localField, attached)
              })
              return relatedItems
            })
          } else if (def.type === 'belongsTo' || (def.type === 'hasOne' && def.localKey)) {
            task = this.findAll(resourceConfig.getResource(relationName), {
              where: {
                [relationDef.idAttribute]: {
                  'in': DSUtils.filter(map(items, item => DSUtils.get(item, def.localKey)), x => x)
                }
              }
            }, __options).then(relatedItems => {
              DSUtils.forEach(items, item => {
                DSUtils.forEach(relatedItems, relatedItem => {
                  if (relatedItem[relationDef.idAttribute] === item[def.localKey]) {
                    DSUtils.set(item, def.localField, relatedItem)
                  }
                })
              })
              return relatedItems
            })
          }

          if (task) {
            tasks.push(task)
          }
        }
      })
      return DSUtils.Promise.all(tasks)
    }).then(() => items)
  }

  create (resourceConfig, attrs, options) {
    return createTask((resolve, reject) => {
      queueTask(() => {
        attrs[resourceConfig.idAttribute] = attrs[resourceConfig.idAttribute] || guid()
        options = options || {}
        this.PUT(
          DSUtils.makePath(this.getIdPath(resourceConfig, options, attrs[resourceConfig.idAttribute])),
          DSUtils.omit(attrs, resourceConfig.relationFields || [])
        ).then(item => {
          this.ensureId(item[resourceConfig.idAttribute], resourceConfig, options)
          resolve(item)
        }).catch(reject)
      })
    })
  }

  createMany (resourceConfig, items, options) {
    return createTask((resolve, reject) => {
      queueTask(() => {
        const tasks = []
        const ids = []
        DSUtils.forEach(items, attrs => {
          const id = attrs[resourceConfig.idAttribute] = attrs[resourceConfig.idAttribute] || guid()
          ids.push(id)
          options = options || {}
          tasks.push(this.PUT(
            DSUtils.makePath(this.getIdPath(resourceConfig, options, id)),
            DSUtils.omit(attrs, resourceConfig.relationFields || [])
          ))
        })
        this.ensureId(ids, resourceConfig, options)
        return DSUtils.Promise.all(tasks).then(resolve).catch(reject)
      })
    })
  }

  update (resourceConfig, id, attrs, options) {
    return createTask((resolve, reject) => {
      queueTask(() => {
        options = options || {}
        this.PUT(this.getIdPath(resourceConfig, options, id), DSUtils.omit(attrs, resourceConfig.relationFields || [])).then(item => {
          this.ensureId(item[resourceConfig.idAttribute], resourceConfig, options)
          resolve(item)
        }).catch(reject)
      })
    })
  }

  updateAll (resourceConfig, attrs, params, options) {
    return this.findAll(resourceConfig, params, options).then(items => {
      const tasks = []
      DSUtils.forEach(items, item => tasks.push(this.update(resourceConfig, item[resourceConfig.idAttribute], DSUtils.omit(attrs, resourceConfig.relationFields || []), options)))
      return DSUtils.Promise.all(tasks)
    })
  }

  destroy (resourceConfig, id, options) {
    return createTask((resolve, reject) => {
      queueTask(() => {
        options = options || {}
        this.DEL(this.getIdPath(resourceConfig, options, id))
          .then(() => this.removeId(id, resourceConfig, options))
          .then(() => resolve(null), reject)
      })
    })
  }

  destroyAll (resourceConfig, params, options) {
    return this.findAll(resourceConfig, params, options).then(items => {
      const ids = []
      DSUtils.forEach(items, item => {
        const id = item[resourceConfig.idAttribute]
        ids.push(id)
        this.storage.removeItem(this.getIdPath(resourceConfig, options, id))
      })
      this.removeId(ids, resourceConfig, options)
      return ids
    })
  }
}

DSLocalStorageAdapter.version = {
  full: '<%= pkg.version %>',
  major: parseInt('<%= major %>', 10),
  minor: parseInt('<%= minor %>', 10),
  patch: parseInt('<%= patch %>', 10),
  alpha: '<%= alpha %>' !== 'false' ? '<%= alpha %>' : false,
  beta: '<%= beta %>' !== 'false' ? '<%= beta %>' : false
}

module.exports = DSLocalStorageAdapter
