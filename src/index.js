import JSData from 'js-data';
import omit from 'mout/object/omit';
import keys from 'mout/object/keys';
import guid from 'mout/random/guid';

let emptyStore = new JSData.DS();
let { DSUtils } = JSData;
let { makePath, deepMixIn, toJson, fromJson, forEach, removeCircular } = DSUtils;
let filter = emptyStore.defaults.defaultFilter;

class Defaults {

}

Defaults.prototype.basePath = '';

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
    return makePath(options.basePath || this.defaults.basePath || resourceConfig.basePath, resourceConfig.getEndpoint(id, options), id);
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
    return this.GET(this.getIdPath(resourceConfig, options || {}, id)).then(item => !item ? DSUtils.Promise.reject(new Error('Not Found!')) : item);
  }

  findAll(resourceConfig, params, options) {
    let _this = this;
    return new DSUtils.Promise(resolve => {
      options = options || {};
      if (!('allowSimpleWhere' in options)) {
        options.allowSimpleWhere = true;
      }
      let items = [];
      let ids = keys(_this.getIds(resourceConfig, options));
      forEach(ids, id => {
        let itemJson = localStorage.getItem(_this.getIdPath(resourceConfig, options, id));
        if (itemJson) {
          items.push(fromJson(itemJson));
        }
      });
      resolve(filter.call(emptyStore, items, resourceConfig.name, params, options));
    });
  }

  create(resourceConfig, attrs, options) {
    let _this = this;
    attrs[resourceConfig.idAttribute] = attrs[resourceConfig.idAttribute] || guid();
    options = options || {};
    return _this.PUT(
      makePath(_this.getIdPath(resourceConfig, options, attrs[resourceConfig.idAttribute])),
      omit(attrs, resourceConfig.relationFields || [])
    ).then(item => {
        _this.ensureId(item[resourceConfig.idAttribute], resourceConfig, options);
        return item;
      });
  }

  update(resourceConfig, id, attrs, options) {
    let _this = this;
    options = options || {};
    return _this.PUT(_this.getIdPath(resourceConfig, options, id), omit(attrs, resourceConfig.relationFields || [])).then(item => {
      _this.ensureId(item[resourceConfig.idAttribute], resourceConfig, options);
      return item;
    });
  }

  updateAll(resourceConfig, attrs, params, options) {
    let _this = this;
    return _this.findAll(resourceConfig, params, options).then(items => {
      let tasks = [];
      forEach(items, item => tasks.push(_this.update(resourceConfig, item[resourceConfig.idAttribute], omit(attrs, resourceConfig.relationFields || []), options)));
      return DSUtils.Promise.all(tasks);
    });
  }

  destroy(resourceConfig, id, options) {
    let _this = this;
    options = options || {};
    return _this.DEL(_this.getIdPath(resourceConfig, options, id)).then(() => _this.removeId(id, resourceConfig.name, options));
  }

  destroyAll(resourceConfig, params, options) {
    let _this = this;
    return _this.findAll(resourceConfig, params, options).then(items => {
      let tasks = [];
      forEach(items, item => tasks.push(_this.destroy(resourceConfig, item[resourceConfig.idAttribute], options)));
      return DSUtils.Promise.all(tasks);
    });
  }
}

export default DSLocalStorageAdapter;
