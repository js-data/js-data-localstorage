<img src="https://raw.githubusercontent.com/js-data/js-data/master/js-data.png" alt="js-data logo" title="js-data" align="right" width="64" height="64" />

## js-data-localstorage [![Slack Status][sl_b]][sl_l] [![npm version][npm_b]][npm_l] [![Circle CI][circle_b]][circle_l] [![npm downloads][dn_b]][dn_l] [![Coverage Status][cov_b]][cov_l] [![Codacy][cod_b]][cod_l]

localStorage adapter for [js-data](http://www.js-data.io/).

Tested on IE9, Chrome 46, Firefox 41 & Safari 7.1 using
<img src="https://raw.githubusercontent.com/js-data/js-data-localstorage/master/bs.jpg" alt="bs logo" title="browserstack" width="150" height="35" style="vertical-align: middle" />

### API Documentation
[DSLocalStorageAdapter](http://www.js-data.io/docs/dslocalstorageadapter)

### Demo
[https://js-data-localstorage.firebaseapp.com/](https://js-data-localstorage.firebaseapp.com/)

### Quick Start
`npm install --save js-data js-data-localstorage` or `bower install --save js-data js-data-localstorage`.

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
- [Slack Channel][sl_l] - Better than IRC!
- [Announcements](http://www.js-data.io/blog)
- [Mailing List](https://groups.io/org/groupsio/jsdata) - Ask your questions!
- [Issues](https://github.com/js-data/js-data-localstorage/issues) - Found a bug? Feature request? Submit an issue!
- [GitHub](https://github.com/js-data/js-data-localstorage) - View the source code for js-data.
- [Contributing Guide](https://github.com/js-data/js-data-localstorage/blob/master/CONTRIBUTING.md)

### Contributing

First, support is handled via the [Slack Channel][sl_l] and the [Mailing List](https://groups.io/org/groupsio/jsdata). Ask your questions there.

When submitting issues on GitHub, please include as much detail as possible to make debugging quick and easy.

- good - Your versions of js-data, js-data-localstorage, etc., relevant console logs/error, code examples that revealed the issue
- better - A [plnkr](http://plnkr.co/), [fiddle](http://jsfiddle.net/), or [bin](http://jsbin.com/?html,output) that demonstrates the issue
- best - A Pull Request that fixes the issue, including test coverage for the issue and the fix

[Github Issues](https://github.com/js-data/js-data-localstorage/issues).

#### Submitting Pull Requests

1. Contribute to the issue/discussion that is the reason you'll be developing in the first place
1. Fork js-data-localstorage
1. `git clone git@github.com:<you>/js-data-localstorage.git`
1. `cd js-data-localstorage; npm install;`
1. Write your code, including relevant documentation and tests
1. Run `npm test` (build and test)
1. Your code will be linted and checked for formatting, the tests will be run
1. The `dist/` folder & files will be generated, do NOT commit `dist/*`! They will be committed when a release is cut.
1. Submit your PR and we'll review!
1. Thanks!

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
