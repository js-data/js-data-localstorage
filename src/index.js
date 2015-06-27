let JSData = require('js-data');
let keys = require('mout/object/keys');
let guid = require('mout/random/guid');

let emptyStore = new JSData.DS();
let { DSUtils } = JSData;
let { omit, makePath, deepMixIn, toJson, fromJson, forEach, removeCircular } = DSUtils;
let filter = emptyStore.defaults.defaultFilter;

class Defaults {

}

Defaults.prototype.basePath = '';

let queue = [];
let taskInProcess = false;

function enqueue(task) {
  queue.push(task);
}

function dequeue() {
  if (queue.length && !taskInProcess) {
    taskInProcess = true;
    queue[0]();
  }
}

function queueTask(task) {
  if (!queue.length) {
    enqueue(task);
    dequeue();
  } else {
    enqueue(task);
  }
}

function createTask(fn) {
  return new DSUtils.Promise(fn).then(result => {
    taskInProcess = false;
    queue.shift();
    setTimeout(dequeue, 0);
    return result;
  }, err => {
    taskInProcess = false;
    queue.shift();
    setTimeout(dequeue, 0);
    return DSUtils.Promise.reject(err);
  });
}

class DSLocalStorageAdapter {
  constructor(options) {
    options = options || {};
    this.defaults = new Defaults();
    deepMixIn(this.defaults, options);
  }

  getPath(resourceConfig, options) {
    return makePath(options.basePath || this.defaults.basePath || resourceConfig.basePath, resourceConfig.name);
  }

  getIdPath(resourceConfig, options, id) {
    return makePath(options.basePath || this.defaults.basePath || resourceConfig.basePath, resourceConfig.endpoint, id);
  }

  getIds(resourceConfig, options) {
    let ids;
    let idsPath = this.getPath(resourceConfig, options);
    let idsJson = localStorage.getItem(idsPath);
    if (idsJson) {
      ids = fromJson(idsJson);
    } else {
      localStorage.setItem(idsPath, toJson({}));
      ids = {};
    }
    return ids;
  }

  saveKeys(ids, resourceConfig, options) {
    localStorage.setItem(this.getPath(resourceConfig, options), toJson(ids));
  }

  ensureId(id, resourceConfig, options) {
    let ids = this.getIds(resourceConfig, options);
    ids[id] = 1;
    this.saveKeys(ids, resourceConfig, options);
  }

  removeId(id, resourceConfig, options) {
    let ids = this.getIds(resourceConfig, options);
    delete ids[id];
    this.saveKeys(ids, resourceConfig, options);
  }

  GET(key) {
    return new DSUtils.Promise(resolve => {
      let item = localStorage.getItem(key);
      resolve(item ? fromJson(item) : undefined);
    });
  }

  PUT(key, value) {
    let DSLocalStorageAdapter = this;
    return DSLocalStorageAdapter.GET(key).then(function (item) {
      if (item) {
        deepMixIn(item, removeCircular(value));
      }
      localStorage.setItem(key, toJson(item || value));
      return DSLocalStorageAdapter.GET(key);
    });
  }

  DEL(key) {
    return new DSUtils.Promise(function (resolve) {
      localStorage.removeItem(key);
      resolve();
    });
  }

  find(resourceConfig, id, options) {
    return createTask((resolve, reject) => {
      queueTask(() => {
        this.GET(this.getIdPath(resourceConfig, options || {}, id))
          .then(item => !item ? reject(new Error('Not Found!')) : resolve(item), reject);
      });
    });
  }

  findAll(resourceConfig, params, options) {
    return createTask((resolve, reject) => {
      queueTask(() => {
        try {
          options = options || {};
          if (!('allowSimpleWhere' in options)) {
            options.allowSimpleWhere = true;
          }
          let items = [];
          let ids = keys(this.getIds(resourceConfig, options));
          forEach(ids, id => {
            let itemJson = localStorage.getItem(this.getIdPath(resourceConfig, options, id));
            if (itemJson) {
              items.push(fromJson(itemJson));
            }
          });
          resolve(filter.call(emptyStore, items, resourceConfig.name, params, options));
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  create(resourceConfig, attrs, options) {
    return createTask((resolve, reject) => {
      queueTask(() => {
        attrs[resourceConfig.idAttribute] = attrs[resourceConfig.idAttribute] || guid();
        options = options || {};
        this.PUT(
          makePath(this.getIdPath(resourceConfig, options, attrs[resourceConfig.idAttribute])),
          omit(attrs, resourceConfig.relationFields || [])
        ).then(item => {
            this.ensureId(item[resourceConfig.idAttribute], resourceConfig, options);
            resolve(item);
          }).catch(reject);
      });
    });
  }

  update(resourceConfig, id, attrs, options) {
    return createTask((resolve, reject) => {
      queueTask(() => {
        options = options || {};
        this.PUT(this.getIdPath(resourceConfig, options, id), omit(attrs, resourceConfig.relationFields || [])).then(item => {
          this.ensureId(item[resourceConfig.idAttribute], resourceConfig, options);
          resolve(item);
        }).catch(reject);
      });
    });
  }

  updateAll(resourceConfig, attrs, params, options) {
    return this.findAll(resourceConfig, params, options).then(items => {
      let tasks = [];
      forEach(items, item => tasks.push(this.update(resourceConfig, item[resourceConfig.idAttribute], omit(attrs, resourceConfig.relationFields || []), options)));
      return DSUtils.Promise.all(tasks);
    });
  }

  destroy(resourceConfig, id, options) {
    return createTask((resolve, reject) => {
      queueTask(() => {
        options = options || {};
        this.DEL(this.getIdPath(resourceConfig, options, id))
          .then(() => this.removeId(id, resourceConfig.name, options))
          .then(() => resolve(null), reject);
      });
    });
  }

  destroyAll(resourceConfig, params, options) {
    return this.findAll(resourceConfig, params, options).then(items => {
      let tasks = [];
      forEach(items, item => tasks.push(this.destroy(resourceConfig, item[resourceConfig.idAttribute], options)));
      return DSUtils.Promise.all(tasks);
    });
  }
}

module.exports = DSLocalStorageAdapter;
