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
