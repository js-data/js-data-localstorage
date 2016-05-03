##### 3.0.0-beta.2 - 02 May 2016

###### Breaking changes

- Changed required API for `LocalStorageAdapter#storage`

    Previously, the API matched that of `localStorage`. Now, the API matches
    that of `localForage`. js-data-localforage will be deprecated, you can now
    use js-data-localstorage with localForage, for example:

    ```js
    var adapter = new LocalStorageAdapter({
      storage: localForage
    })
    ```

##### 3.0.0-beta.1 - 30 April 2016

Official v3 beta release

###### Breaking changes
- How you must now import in ES2015:

    ```js
    import LocalStorageAdapter from 'js-data-localstorage'
    const adapter = new LocalStorageAdapter()
    ```
    or
    ```js
    import {LocalStorageAdapter, version} from 'js-data-localstorage'
    console.log(version)
    const adapter = new LocalStorageAdapter()
    ```

- How you must now import in ES5:

    ```js
    var JSDataLocalStorage = require('js-data-localstorage')
    var LocalStorageAdapter = JSDataLocalStorage.LocalStorageAdapter
    var adapter = new LocalStorageAdapter()
    ```

- Moved some `dist` files to `release` to reduce noise

###### Other
- Upgraded dependencies
- Improved JSDoc comments
- Now using js-data JSDoc template

##### 3.0.0-alpha.7 - 18 March 2016

###### Backwards compatible API changes
- Added count and sum methods

##### 3.0.0-alpha.6 - 10 March 2016

###### Other
- Now using js-data-repo-tools
- Now using js-data-adapter

##### 3.0.0-alpha.5 - 26 February 2016

- Couple of fixes

##### 3.0.0-alpha.4 - 23 February 2016

- Improved find, destroy, and update methods
- Upgraded to js-data-adapter-tests@2.0.0-alpha.6

##### 3.0.0-alpha.3 - 23 February 2016

- Upgraded dependencies
- Updated Readme

##### 3.0.0-alpha.2 - 13 February 2016

- Now making use of JSData.utils.forEachRelation

##### 3.0.0-alpha.1 - 13 February 2016

- Added support for `raw` option
- Added lifecycle hooks

##### 2.3.2 - 12 December 2015

###### Backwards compatible bug fixes
- #17 - Id map clean-up

##### 2.3.0 - 24 November 2015

###### Backwards compatible API changes
- Added a createMany method

###### Backwards compatible bug fixes
- #14 - Id clean-up
- #15, #15 - Performance

##### 2.2.0 - 11 November 2015

###### Backwards compatible API changes
- Added support for custom storage medium

##### 2.1.3 - 10 November 2015

###### Other
- Rebuilt with Babel v6
- CI tests now run on Browserstack

##### 2.1.2 - 30 October 2015

###### Other
- Dropped Grunt
- Now reporting code coverage properly

##### 2.1.1 - 10 July 2015

###### Backwards compatible bug fixes
- Fix for loading relations in find() and findAll()

##### 2.1.0 - 10 July 2015

Upgraded dependencies

###### Backwards compatible API changes
- #10 - Add support for loading relations in find()
- #11 - Add support for loading relations in findAll()

##### 2.0.1 - 02 July 2015

Removed unnecessary dependency

##### 2.0.0 - 02 July 2015

Stable Version 2.0.0

##### 2.0.0-rc.1 - 27 June 2015

###### Breaking API changes
- Removed use of `getEndpoint()`, now just using `endpoint`. Data will now potentially be stored under different keys than before.

##### 2.0.0-beta.4 - 18 April 2015

Fix

##### 2.0.0-beta.3 - 18 April 2015

###### Backwards compatible bug fixes
- #9 - Race condition, tasks need to be atomic

##### 2.0.0-beta.1 - 17 April 2015

Prepare for 2.0.

##### 1.1.1 - 25 March 2015

Using `import` instead of require. Fix possible value undefined errors.

##### 1.1.0 - 25 March 2015

Upgrade dependencies. js-data is now a peer dependency.

Fixed #7

##### 1.0.1 - 10 March 2015

Convert to ES6.

##### 1.0.0 - 03 February 2015

Stable Version 1.0.0

##### 1.0.0-beta.1 - 10 January 2015

Now in beta.

##### 1.0.0-alpha.1 - 31 October 2014

Update dependencies

##### 0.4.1 - 01 October 2014

###### Other
- Better checking for the js-data dependency

##### 0.4.0 - 25 September 2014

###### Breaking API changes
- Refactored from `baseUrl` to `basePath`, as `baseUrl` doesn't make sense for all adapters, but `basePath` does

##### 0.3.0 - 23 September 2014

- Find now throws an error if the item isn't found

##### 0.2.0 - 21 September 2014

- Added support for collection-based methods

##### 0.1.0 - 17 September 2014

- Initial release
