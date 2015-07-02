<img src="https://raw.githubusercontent.com/js-data/js-data/master/js-data.png" alt="js-data logo" title="js-data" align="right" width="64" height="64" />

## js-data-localstorage [![bower version](https://img.shields.io/bower/v/js-data-localstorage.svg?style=flat-square)](https://www.npmjs.org/package/js-data-localstorage) [![npm version](https://img.shields.io/npm/v/js-data-localstorage.svg?style=flat-square)](https://www.npmjs.org/package/js-data-localstorage) [![Circle CI](https://img.shields.io/circleci/project/js-data/js-data-localstorage/master.svg?style=flat-square)](https://circleci.com/gh/js-data/js-data-localstorage/tree/master) [![npm downloads](https://img.shields.io/npm/dm/js-data-localstorage.svg?style=flat-square)](https://www.npmjs.org/package/js-data-localstorage) [![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/js-data/js-data-localstorage/blob/master/LICENSE)

localStorage adapter for [js-data](http://www.js-data.io/).

### API Documentation
[DSLocalStorageAdapter](http://www.js-data.io/docs/dslocalstorageadapter)

### Demo
[https://js-data-localstorage.firebaseapp.com/](https://js-data-localstorage.firebaseapp.com/)

### Project Status

__Latest Release:__ [![Latest Release](https://img.shields.io/github/release/js-data/js-data-localstorage.svg?style=flat-square)](https://github.com/js-data/js-data-localstorage/releases)

__Status:__

[![Dependency Status](https://img.shields.io/gemnasium/js-data/js-data-localstorage.svg?style=flat-square)](https://gemnasium.com/js-data/js-data-localstorage) [![Coverage Status](https://img.shields.io/coveralls/js-data/js-data-localstorage/master.svg?style=flat-square)](https://coveralls.io/r/js-data/js-data-localstorage?branch=master) [![Codacity](https://img.shields.io/codacy/b8e46008e6ad45159b7a6927dbfd66c3.svg?style=flat-square)](https://www.codacy.com/public/jasondobry/js-data-localstorage/dashboard)

__Supported Platforms:__

[![browsers](https://img.shields.io/badge/Browser-Chrome%2CFirefox%2CSafari%2COpera%2CIE%209%2B%2CiOS%20Safari%207.1%2B%2CAndroid%20Browser%202.3%2B-green.svg?style=flat-square)](https://github.com/js-data/js-data)

### Quick Start
`bower install --save js-data js-data-localstorage` or `npm install --save js-data js-data-localstorage`.

Load `js-data-localstorage.js` after `js-data.js`.

```js
var adapter = new DSLocalStorageAdapter();

var store = new JSData.DS();
store.registerAdapter('localstorage', adapter, { default: true });

// "store" will now use the localstorage adapter for all async operations
```

### Changelog
[CHANGELOG.md](https://github.com/js-data/js-data-localstorage/blob/master/CHANGELOG.md)

### Community
- [Gitter Channel](https://gitter.im/js-data/js-data) - Better than IRC!
- [Announcements](http://www.js-data.io/blog)
- [Mailing List](https://groups.io/org/groupsio/jsdata) - Ask your questions!
- [Issues](https://github.com/js-data/js-data-localstorage/issues) - Found a bug? Feature request? Submit an issue!
- [GitHub](https://github.com/js-data/js-data-localstorage) - View the source code for js-data.
- [Contributing Guide](https://github.com/js-data/js-data-localstorage/blob/master/CONTRIBUTING.md)

### Contributing

First, support is handled via the [Mailing List](https://groups.io/org/groupsio/jsdata). Ask your questions there.

When submitting issues on GitHub, please include as much detail as possible to make debugging quick and easy.

- good - Your versions of js-data, js-data-localstorage, etc., relevant console logs/error, code examples that revealed the issue
- better - A [plnkr](http://plnkr.co/), [fiddle](http://jsfiddle.net/), or [bin](http://jsbin.com/?html,output) that demonstrates the issue
- best - A Pull Request that fixes the issue, including test coverage for the issue and the fix

[Github Issues](https://github.com/js-data/js-data-localstorage/issues).

1. Contribute to the issue that is the reason you'll be developing in the first place
1. Fork js-data-localstorage
1. `git clone https://github.com/<you>/js-data-localstorage.git`
1. `cd js-data-localstorage; npm install; bower install;`
1. `grunt go` (builds and starts a watch)
1. (in another terminal) `grunt karma:dev` (runs the tests)
1. Write your code, including relevant documentation and tests
1. Submit a PR and we'll review

### License

The MIT License (MIT)

Copyright (c) 2014-2015 Jason Dobry

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
