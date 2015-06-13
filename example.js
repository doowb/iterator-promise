var fs = require('fs');
var iterator = require('./');
var Promise = require('bluebird');
Promise.promisifyAll(fs);

var stack = [
  Promise.method(function (fp) { return fs.readFileAsync(fp, 'utf8'); }),
  Promise.method(function (contents) { return JSON.parse(contents); })
];
var readJSON = iterator(stack);
readJSON('./package.json')
  .then(function (pkg) {
    console.log(pkg);
  });
