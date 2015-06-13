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
  return function (/* arguments */) {
    var Promise = require('bluebird');
    var self = this;
    var args = [].slice.call(arguments);
    var current = Promise.method(function (arg) {
      return arg;
    });

    if (!stack.length) {
      return current(args[0]);
    }
    var first = stack.shift();
    if (!stack.length) {
      return first.apply(self, args);
    }
    return Promise.reduce(stack, function (acc, fn) {
      return fn(acc);
    }, first.apply(self, args));
  };
};
