/*
 * js-data-localStorage
 * http://github.com/js-data/js-data-localStorage
 *
 * Copyright (c) 2014 Jason Dobry <http://www.js-data.io/js-data-localStorage>
 * Licensed under the MIT license. <https://github.com/js-data/js-data-localStorage/blob/master/LICENSE>
 */
module.exports = function (grunt) {
  'use strict';

  require('jit-grunt')(grunt, {
    coveralls: 'grunt-karma-coveralls'
  });
  require('time-grunt')(grunt);

  var pkg = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    clean: {
      coverage: ['coverage/'],
      dist: ['dist/']
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/*.js'],
      jshintrc: '.jshintrc'
    },
    watch: {
      dist: {
        files: ['src/**/*.js'],
        tasks: ['build']
      }
    },
    uglify: {
      main: {
        options: {
          banner: '/**\n' +
            '* @author Jason Dobry <jason.dobry@gmail.com>\n' +
            '* @file js-data-localStorage.min.js\n' +
            '* @version <%= pkg.version %> - Homepage <http://wwwjs-data.io/js-data-localStorage>\n' +
            '* @copyright (c) 2014 Jason Dobry\n' +
            '* @license MIT <https://github.com/js-data/js-data-localStorage/blob/master/LICENSE>\n' +
            '*\n' +
            '* @overview My Adapter.\n' +
            '*/\n'
        },
        files: {
          'dist/js-data-localStorage.min.js': ['dist/js-data-localStorage.js']
        }
      }
    },
    browserify: {
      options: {
        browserifyOptions: {
          standalone: 'LocalStorageAdapter'
        }
      },
      dist: {
        files: {
          'dist/js-data-localStorage.js': ['src/index.js']
        }
      }
    },
    karma: {
      options: {
        configFile: './karma.conf.js'
      },
      dev: {
        browsers: ['Chrome'],
        autoWatch: true,
        singleRun: false,
        reporters: ['spec'],
        preprocessors: {}
      },
      min: {
        browsers: ['Firefox', 'PhantomJS'],
        options: {
          files: [
            'dist/js-data-localStorage.min.js',
            'karma.start.js',
            'test/**/*.js'
          ]
        }
      },
      ci: {
        browsers: ['Firefox']
      }
    },
    coveralls: {
      options: {
        coverage_dir: 'coverage'
      }
    }
  });

  grunt.registerTask('version', function (filePath) {
    var file = grunt.file.read(filePath);

    file = file.replace(/<%= pkg\.version %>/gi, pkg.version);

    grunt.file.write(filePath, file);
  });

  grunt.registerTask('banner', function () {
    var file = grunt.file.read('dist/js-data-localStorage.js');

    var banner = '/**\n' +
      '* @author Jason Dobry <jason.dobry@gmail.com>\n' +
      '* @file js-data-localStorage.js\n' +
      '* @version ' + pkg.version + ' - Homepage <http://www.js-data.iojs-data-localStorage/>\n' +
      '* @copyright (c) 2014 Jason Dobry \n' +
      '* @license MIT <https://github.com/js-data/js-data-localStorage/blob/master/LICENSE>\n' +
      '*\n' +
      '* @overview My Adapter.\n' +
      '*/\n';

    file = banner + file;

    grunt.file.write('dist/js-data-localStorage.js', file);
  });

  grunt.registerTask('test', ['build', 'karma:ci', 'karma:min']);
  grunt.registerTask('build', [
    'clean',
    'jshint',
    'browserify',
    'banner',
    'uglify:main'
  ]);
  grunt.registerTask('go', ['build', 'watch:dist']);
  grunt.registerTask('default', ['build']);
};
