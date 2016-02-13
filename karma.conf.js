var customLaunchers = {
	bs_ie9_windows7: {
		base: 'BrowserStack',
		browser: 'ie',
		browser_version: '9.0',
		os: 'Windows',
		os_version: '7'
	},
	bs_safari7_osxmavericks: {
		base: 'BrowserStack',
		browser: 'safari',
		browser_version: '7.1',
		os: 'OS X',
		os_version: 'Mavericks'
	},
	bs_firefox41_windows7: {
		base: 'BrowserStack',
		browser: 'firefox',
		browser_version: '41.0',
		os: 'Windows',
		os_version: '7'
	},
	bs_chrome46_windows7: {
		base: 'BrowserStack',
		browser: 'chrome',
		browser_version: '46.0',
		os: 'Windows',
		os_version: '7'
	}
};

var browsers = ['PhantomJS'];
if (
	process.env.BROWSERSTACK_USERNAME &&
	process.env.BROWSERSTACK_ACCESS_KEY
) {
	browsers = browsers.concat(Object.keys(customLaunchers));
}

module.exports = function (config) {
	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: './',
		frameworks: ['mocha'],
		plugins: [
			// these plugins will be require() by Karma
			'karma-mocha',
			'karma-phantomjs-launcher',
			'karma-coverage',
			'karma-browserstack-launcher',
			'karma-junit-reporter'
		],
		autoWatch: false,
		autoWatchBatchDelay: 4000,
		browsers: browsers,

		// list of files / patterns to load in the browser
		files: [
			'node_modules/es6-promise/dist/es6-promise.js',
			'node_modules/js-data/dist/js-data.js',
			'dist/js-data-localstorage.js',
			'node_modules/js-data-adapter-tests/dist/js-data-adapter-tests.js',
			'karma.start.js'
		],

		reporters: ['dots', 'coverage', 'junit'],

		preprocessors: {
			'dist/js-data-localstorage.js': ['coverage']
		},

		// optionally, configure the reporter
		coverageReporter: {
			type: 'lcov',
			dir: 'coverage/',
			instrumenterOptions: {
        istanbul: { noCompact: true }
      }
		},

    // the default configuration
    junitReporter: {
      outputDir: process.env.CIRCLE_TEST_REPORTS || 'junit',
      outputFile: undefined,
      suite: 'js-data-localstorage',
      useBrowserName: false
    },

		browserStack: {
			username: process.env.BROWSERSTACK_USERNAME,
			accessKey: process.env.BROWSERSTACK_ACCESS_KEY
		},

		customLaunchers: customLaunchers,

		browserNoActivityTimeout: 90000,

		// web server port
		port: 9876,

		// cli runner port
		runnerPort: 9100,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		logLevel: config.LOG_INFO,

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 90000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: true
	});
};
