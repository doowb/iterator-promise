/*!
 * iterator-promise <https://github.com/doowb/iterator-promise>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

/**
 * Iterate over a stack of promise functions passing the results of
 * each function to the next function in the stack.
 *
 * @param  {Array} `stack` Array of functions to call.
 * @return {Function} Returns a function that will iterator over the given stack of functions.
 * @api public
 * @name  iterator
 */


module.exports = function iteratorPromise (stack) {
  return function (obj) {
    var Promise = require('bluebird');
    var current = Promise.resolve();

    if (!stack.length) {
      return current.then(function () {
        return obj;
      });
    }

    return Promise.reduce(stack, function (acc, fn) {
      return fn(acc);
    }, obj);
  };
};
