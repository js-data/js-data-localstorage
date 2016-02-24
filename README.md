<img src="https://raw.githubusercontent.com/js-data/js-data/master/js-data.png" alt="js-data logo" title="js-data" align="right" width="96" height="96" />

# js-data-localstorage

[![Slack Status][sl_b]][sl_l]
[![npm version][npm_b]][npm_l]
[![Circle CI][circle_b]][circle_l]
[![npm downloads][dn_b]][dn_l]
[![Coverage Status][cov_b]][cov_l]
[![Codacy][cod_b]][cod_l]

localStorage adapter for [js-data](http://www.js-data.io/).

Tested on IE9, Chrome 46, Firefox 41 & Safari 7.1 using
<img src="https://raw.githubusercontent.com/js-data/js-data-localstorage/master/bs.jpg" alt="bs logo" title="browserstack" width="150" height="35" style="vertical-align: middle" />

## Table of contents

* [Quick start](#quick-start)
* [Guides and Tutorials](#guides-and-tutorials)
* [API Reference](#api-reference)
* [Demo](#demo)
* [Support](#support)
* [Community](#community)
* [Contributing](#contributing)
* [License](#license)

## Quick Start

`npm install --save js-data js-data-localstorage` or `bower install --save js-data js-data-localstorage`.

Load `js-data-localstorage.js` after `js-data.js`.

```js
var adapter = new LocalStorageAdapter();

var store = new JSData.DataStore();
store.registerAdapter('localstorage', adapter, { default: true });

// "store" will now use the localstorage adapter
```

You can also provide a custom storage medium (it just needs to implement the `localStorage` API):

```js
var memory = {};

// Turn js-data-localstorage into an in-memory adapter
var memoryAdapter = new LocalStorageAdapter({
  storage: {
    getItem: function (key) {
      return memory[key];
    },
    setItem: function (key, value) {
      return memory[key] = value;
    },
    removeItem: function (key) {
      delete memory[key];
    }
  }
});

// Turn js-data-localstorage into a sessionStorage adapter
var sessionAdapter = new LocalStorageAdapter({
  storage: sessionStorage
});
```

## Guides and Tutorials

[Get started at http://js-data.io](http://js-data.io)

## API Reference Docs

[Visit http://api.js-data.io](http://api.js-data.io).

## Demo

https://js-data-localstorage.firebaseapp.com/

## Community

[Explore the Community](http://js-data.io/docs/community).

## Support

[Find out how to Get Support](http://js-data.io/docs/support).

## Contributing

[Read the Contributing Guide](http://js-data.io/docs/contributing).

## License

The MIT License (MIT)

Copyright (c) 2014-2016 js-data-http project authors

* [LICENSE](https://github.com/js-data/js-data-localstorage/blob/master/LICENSE)
* [AUTHORS](https://github.com/js-data/js-data-localstorage/blob/master/AUTHORS)
* [CONTRIBUTORS](https://github.com/js-data/js-data-localstorage/blob/master/CONTRIBUTORS)

[sl_b]: http://slack.js-data.io/badge.svg
[sl_l]: http://slack.js-data.io
[npm_b]: https://img.shields.io/npm/v/js-data-localstorage.svg?style=flat
[npm_l]: https://www.npmjs.org/package/js-data-localstorage
[circle_b]: https://img.shields.io/circleci/project/js-data/js-data-localstorage/master.svg?style=flat
[circle_l]: https://circleci.com/gh/js-data/js-data-localstorage/tree/master
[dn_b]: https://img.shields.io/npm/dm/js-data-localstorage.svg?style=flat
[dn_l]: https://www.npmjs.org/package/js-data-localstorage
[cov_b]: https://img.shields.io/coveralls/js-data/js-data-localstorage/master.svg?style=flat
[cov_l]: https://coveralls.io/github/js-data/js-data-localstorage?branch=master
[cod_b]: https://img.shields.io/codacy/b8e46008e6ad45159b7a6927dbfd66c3.svg
[cod_l]: https://www.codacy.com/app/jasondobry/js-data-localstorage/dashboard
[so]: http://stackoverflow.com/questions/tagged/jsdata
