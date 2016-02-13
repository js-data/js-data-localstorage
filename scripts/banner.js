var fs = require('fs');
var pkg = require('../package.json');

var banner = '/*!\n' +
  '* js-data-localstorage\n' +
  '* @version ' + pkg.version + ' - Homepage <https://github.com/js-data/js-data-localstorage>\n' +
  '* @author Jason Dobry <jason.dobry@gmail.com>\n' +
  '* @copyright (c) 2014-2016 Jason Dobry\n' +
  '* @license MIT <https://github.com/js-data/js-data-localstorage/blob/master/LICENSE>\n' +
  '*\n' +
  '* @overview localStorage adapter for js-data.\n' +
  '*/\n';

console.log('Adding banner to dist/ files...');

function addBanner(filepath) {
  var contents = fs.readFileSync(filepath, {
    encoding: 'utf-8'
  });
  if (contents.substr(0, 3) !== '/*!') {
    fs.writeFileSync(filepath, banner + contents, {
      encoding: 'utf-8'
    });
  }
}

addBanner('dist/js-data-localstorage.js');
addBanner('dist/js-data-localstorage.min.js');

console.log('Done!');
