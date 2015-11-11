module.exports = {
  entry: './src/index.js',
  output: {
    filename: './dist/js-data-localstorage.js',
    libraryTarget: 'umd',
    library: 'DSLocalStorageAdapter'
  },
  externals: {
    'js-data': {
      amd: 'js-data',
      commonjs: 'js-data',
      commonjs2: 'js-data',
      root: 'JSData'
    }
  },
  module: {
    loaders: [
      {
        test: /(src)(.+)\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};