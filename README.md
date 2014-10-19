<img src="https://raw.githubusercontent.com/js-data/js-data/master/js-data.png" alt="js-data logo" title="js-data" align="right" width="64" height="64" />

## js-data-localstorage

localStorage adapter for [js-data](http://www.js-data.io/js-data).

## API Documentation
[DSLocalStorageAdapter](http://www.js-data.io/docs/dslocalstorageadapter)

## Demo
[https://js-data-localstorage.firebaseapp.com/](https://js-data-localstorage.firebaseapp.com/)

## Project Status

| Branch | Master |
| ------ | ------ |
| Bower | [![Bower version](https://badge.fury.io/bo/js-data-localstorage.png)](http://badge.fury.io/bo/js-data-localstorage) |
| NPM | [![NPM version](https://badge.fury.io/js/js-data-localstorage.png)](http://badge.fury.io/js/js-data-localstorage) |
| Build Status | [![Build Status](https://travis-ci.org/js-data/js-data-localstorage.png?branch=master)](https://travis-ci.org/js-data/js-data-localstorage) |
| Code Climate | [![Code Climate](https://codeclimate.com/github/js-data/js-data-localstorage.png)](https://codeclimate.com/github/js-data/js-data-localstorage) |
| Dependency Status | [![Dependency Status](https://gemnasium.com/js-data/js-data-localstorage.png)](https://gemnasium.com/js-data/js-data-localstorage) |
| Coverage | [![Coverage Status](https://coveralls.io/repos/js-data/js-data-localstorage/badge.png?branch=master)](https://coveralls.io/r/js-data/js-data-localstorage?branch=master) |

## Quick Start
`bower install --save js-data js-data-localstorage` or `npm install --save js-data js-data-localstorage`.

Load `js-data-localstorage.js` after `js-data.js`.

```js
var adapter = new DSLocalStorageAdapter();

var store = new JSData.DS();
store.registerAdapter('localstorage', adapter, { default: true });

// "store" will now use the localstorage adapter for all async operations
```

## Changelog
[CHANGELOG.md](https://github.com/js-data/js-data-localstorage/blob/master/CHANGELOG.md)

## Community
- [Mailing List](https://groups.io/org/groupsio/jsdata) - Ask your questions!
- [Issues](https://github.com/js-data/js-data-localstorage/issues) - Found a bug? Feature request? Submit an issue!
- [GitHub](https://github.com/js-data/js-data-localstorage) - View the source code for js-data.
- [Contributing Guide](https://github.com/js-data/js-data-localstorage/blob/master/CONTRIBUTING.md)

## Contributing

First, feel free to contact me with questions. [Mailing List](https://groups.io/org/groupsio/jsdata). [Issues](https://github.com/js-data/js-data-localstorage/issues).

1. Contribute to the issue that is the reason you'll be developing in the first place
1. Fork js-data-localstorage
1. `git clone https://github.com/<you>/js-data-localstorage.git`
1. `cd js-data-localstorage; npm install; bower install;`
1. `grunt go` (builds and starts a watch)
1. (in another terminal) `grunt karma:dev` (runs the tests)
1. Write your code, including relevant documentation and tests
1. Submit a PR and we'll review

## License

The MIT License (MIT)

Copyright (c) 2014 Jason Dobry

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
