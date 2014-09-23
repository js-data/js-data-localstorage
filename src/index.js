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

function DSLocalStorageAdapter(options) {
  options = options || {};

  if (!DSUtils.isString(options.namespace)) {
    options.namespace = 'DS';
  }

  this.defaults = new Defaults();
  deepMixIn(this.defaults, options);
}

DSLocalStorageAdapter.prototype.getIds = function (name, options) {
  var ids;
  var idsPath = makePath(options.namespace || this.defaults.namespace, 'DSKeys', name);
  var idsJson = localStorage.getItem(idsPath);
  if (idsJson) {
    ids = fromJson(idsJson);
  } else {
    localStorage.setItem(idsPath, toJson({}));
    ids = {};
  }
  return ids;
};

DSLocalStorageAdapter.prototype.saveKeys = function (ids, name, options) {
  var keysPath = makePath(options.namespace || this.defaults.namespace, 'DSKeys', name);
  localStorage.setItem(keysPath, toJson(ids));
};

DSLocalStorageAdapter.prototype.ensureId = function (id, name, options) {
  var ids = this.getIds(name, options);
  ids[id] = 1;
  this.saveKeys(ids, name, options);
};

DSLocalStorageAdapter.prototype.removeId = function (id, name, options) {
  var ids = this.getIds(name, options);
  delete ids[id];
  this.saveKeys(ids, name, options);
};

DSLocalStorageAdapter.prototype.GET = function (key) {
  return new P(function (resolve) {
    var item = localStorage.getItem(key);
    resolve(item ? fromJson(item) : undefined);
  });
};

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

DSLocalStorageAdapter.prototype.DEL = function (key) {
  return new P(function (resolve) {
    localStorage.removeItem(key);
    resolve();
  });
};

DSLocalStorageAdapter.prototype.find = function find(resourceConfig, id, options) {
  options = options || {};
  return this.GET(makePath(options.namespace || this.defaults.namespace, resourceConfig.getEndpoint(id, options), id)).then(function (item) {
    if (!item) {
      return P.reject(new Error('Not Found!'));
    } else {
      return item;
    }
  });
};

DSLocalStorageAdapter.prototype.findAll = function (resourceConfig, params, options) {
  var _this = this;
  return new P(function (resolve) {
    options = options || {};
    if (!('allowSimpleWhere' in options)) {
      options.allowSimpleWhere = true;
    }
    var items = [];
    var ids = keys(_this.getIds(resourceConfig.name, options));
    forEach(ids, function (id) {
      var itemJson = localStorage.getItem(makePath(options.namespace || _this.defaults.namespace, resourceConfig.getEndpoint(id, options), id));
      if (itemJson) {
        items.push(fromJson(itemJson));
      }
    });
    resolve(filter.call(emptyStore, items, resourceConfig.name, params, options));
  });
};

DSLocalStorageAdapter.prototype.create = function (resourceConfig, attrs, options) {
  var _this = this;
  attrs[resourceConfig.idAttribute] = attrs[resourceConfig.idAttribute] || guid();
  options = options || {};
  return this.PUT(
    makePath(options.namespace || this.defaults.namespace, resourceConfig.getEndpoint(attrs, options), attrs[resourceConfig.idAttribute]),
    attrs
  ).then(function (item) {
      _this.ensureId(item[resourceConfig.idAttribute], resourceConfig.name, options);
      return item;
    });
};

DSLocalStorageAdapter.prototype.update = function (resourceConfig, id, attrs, options) {
  var _this = this;
  options = options || {};
  return this.PUT(makePath(options.namespace || this.defaults.namespace, resourceConfig.getEndpoint(id, options), id), attrs).then(function (item) {
    _this.ensureId(item[resourceConfig.idAttribute], resourceConfig.name, options);
    return item;
  });
};

DSLocalStorageAdapter.prototype.updateAll = function (resourceConfig, attrs, params, options) {
  var _this = this;
  return this.findAll(resourceConfig, params, options).then(function (items) {
    var tasks = [];
    forEach(items, function (item) {
      tasks.push(_this.update(resourceConfig, item[resourceConfig.idAttribute], attrs, options));
    });
    return P.all(tasks);
  });
};

DSLocalStorageAdapter.prototype.destroy = function (resourceConfig, id, options) {
  var _this = this;
  options = options || {};
  return this.DEL(makePath(options.namespace || this.defaults.namespace, resourceConfig.getEndpoint(id, options), id)).then(function () {
    _this.removeId(id, resourceConfig.name, options);
  });
};

DSLocalStorageAdapter.prototype.destroyAll = function (resourceConfig, params, options) {
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
