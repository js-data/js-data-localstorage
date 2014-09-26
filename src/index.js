var JSData;
if (!window && typeof module !== 'undefined' && module.exports) {
  JSData = require('js-data');
} else {
  JSData = window.JSData;
}

var emptyStore = new JSData.DS();
var DSUtils = JSData.DSUtils;
var makePath = DSUtils.makePath;
var deepMixIn = DSUtils.deepMixIn;
var toJson = DSUtils.toJson;
var fromJson = DSUtils.fromJson;
var forEach = DSUtils.forEach;
var filter = emptyStore.defaults.defaultFilter;
var guid = require('mout/random/guid');
var keys = require('mout/object/keys');
var P = DSUtils.Promise;

function Defaults() {

}

Defaults.prototype.basePath = '';

function DSLocalStorageAdapter(options) {
  options = options || {};
  this.defaults = new Defaults();
  deepMixIn(this.defaults, options);
}

var dsLocalStorageAdapterPrototype = DSLocalStorageAdapter.prototype;

dsLocalStorageAdapterPrototype.getPath = function (resourceConfig, options) {
  return makePath(options.basePath || this.defaults.basePath || resourceConfig.basePath, resourceConfig.name);
};

dsLocalStorageAdapterPrototype.getIdPath = function (resourceConfig, options, id) {
  return makePath(options.basePath || this.defaults.basePath || resourceConfig.basePath, resourceConfig.getEndpoint(id, options), id);
};

dsLocalStorageAdapterPrototype.getIds = function (resourceConfig, options) {
  var ids;
  var idsPath = this.getPath(resourceConfig, options);
  var idsJson = localStorage.getItem(idsPath);
  if (idsJson) {
    ids = fromJson(idsJson);
  } else {
    localStorage.setItem(idsPath, toJson({}));
    ids = {};
  }
  return ids;
};

dsLocalStorageAdapterPrototype.saveKeys = function (ids, resourceConfig, options) {
  var keysPath = this.getPath(resourceConfig, options);
  localStorage.setItem(keysPath, toJson(ids));
};

dsLocalStorageAdapterPrototype.ensureId = function (id, resourceConfig, options) {
  var ids = this.getIds(resourceConfig, options);
  ids[id] = 1;
  this.saveKeys(ids, resourceConfig, options);
};

dsLocalStorageAdapterPrototype.removeId = function (id, resourceConfig, options) {
  var ids = this.getIds(resourceConfig, options);
  delete ids[id];
  this.saveKeys(ids, resourceConfig, options);
};

dsLocalStorageAdapterPrototype.GET = function (key) {
  return new P(function (resolve) {
    var item = localStorage.getItem(key);
    resolve(item ? fromJson(item) : undefined);
  });
};

dsLocalStorageAdapterPrototype.PUT = function (key, value) {
  var DSLocalStorageAdapter = this;
  return DSLocalStorageAdapter.GET(key).then(function (item) {
    if (item) {
      deepMixIn(item, value);
    }
    localStorage.setItem(key, toJson(item || value));
    return DSLocalStorageAdapter.GET(key);
  });
};

dsLocalStorageAdapterPrototype.DEL = function (key) {
  return new P(function (resolve) {
    localStorage.removeItem(key);
    resolve();
  });
};

dsLocalStorageAdapterPrototype.find = function find(resourceConfig, id, options) {
  options = options || {};
  return this.GET(this.getIdPath(resourceConfig, options, id)).then(function (item) {
    if (!item) {
      return P.reject(new Error('Not Found!'));
    } else {
      return item;
    }
  });
};

dsLocalStorageAdapterPrototype.findAll = function (resourceConfig, params, options) {
  var _this = this;
  return new P(function (resolve) {
    options = options || {};
    if (!('allowSimpleWhere' in options)) {
      options.allowSimpleWhere = true;
    }
    var items = [];
    var ids = keys(_this.getIds(resourceConfig, options));
    forEach(ids, function (id) {
      var itemJson = localStorage.getItem(_this.getIdPath(resourceConfig, options, id));
      if (itemJson) {
        items.push(fromJson(itemJson));
      }
    });
    resolve(filter.call(emptyStore, items, resourceConfig.name, params, options));
  });
};

dsLocalStorageAdapterPrototype.create = function (resourceConfig, attrs, options) {
  var _this = this;
  attrs[resourceConfig.idAttribute] = attrs[resourceConfig.idAttribute] || guid();
  options = options || {};
  return this.PUT(
    makePath(this.getIdPath(resourceConfig, options, attrs[resourceConfig.idAttribute])),
    attrs
  ).then(function (item) {
      _this.ensureId(item[resourceConfig.idAttribute], resourceConfig, options);
      return item;
    });
};

dsLocalStorageAdapterPrototype.update = function (resourceConfig, id, attrs, options) {
  var _this = this;
  options = options || {};
  return this.PUT(this.getIdPath(resourceConfig, options, id), attrs).then(function (item) {
    _this.ensureId(item[resourceConfig.idAttribute], resourceConfig, options);
    return item;
  });
};

dsLocalStorageAdapterPrototype.updateAll = function (resourceConfig, attrs, params, options) {
  var _this = this;
  return this.findAll(resourceConfig, params, options).then(function (items) {
    var tasks = [];
    forEach(items, function (item) {
      tasks.push(_this.update(resourceConfig, item[resourceConfig.idAttribute], attrs, options));
    });
    return P.all(tasks);
  });
};

dsLocalStorageAdapterPrototype.destroy = function (resourceConfig, id, options) {
  var _this = this;
  options = options || {};
  return this.DEL(this.getIdPath(resourceConfig, options, id)).then(function () {
    _this.removeId(id, resourceConfig.name, options);
  });
};

dsLocalStorageAdapterPrototype.destroyAll = function (resourceConfig, params, options) {
  var _this = this;
  return this.findAll(resourceConfig, params, options).then(function (items) {
    var tasks = [];
    forEach(items, function (item) {
      tasks.push(_this.destroy(resourceConfig, item[resourceConfig.idAttribute], options));
    });
    return P.all(tasks);
  });
};

module.exports = DSLocalStorageAdapter;
