var babel = require('rollup-plugin-babel')
var commonjs = require('rollup-plugin-commonjs')
var nodeResolve = require('rollup-plugin-node-resolve')

module.exports = {
  moduleName: 'JSDataLocalStorage',
  moduleId: 'js-data-localstorage',
  external: [
    'js-data'
  ],
  globals: {
    'js-data': 'JSData'
  },
  plugins: [
    babel({
      babelrc: false,
      plugins: [
        'babel-plugin-external-helpers'
      ],
      presets: [
        [
          'es2015',
          {
            modules: false
          }
        ]
      ],
      exclude: ['node_modules/mout/**/*']
    }),
    nodeResolve({
      jsnext: false,
      main: true
    }),
    commonjs({
      include: 'node_modules/mout/**',
      sourceMap: true
    })
  ]
}
