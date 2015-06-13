'use strict';

var Promise = require('bluebird');
var assert = require('assert');
var iterator = require('./');

describe('iterator-async', function () {
  it('should create an iterator function when given a stack', function () {
    var called = [];
    var stack = getStack(called);
    var fn = iterator(stack);
    assert.equal(typeof fn, 'function');
  });

  it('should iterate over a stack of functions', function (done) {
    var called = [];
    var stack = getStack(called);
    iterator(stack)('foo', 'bar')
      .then(function (actual) {
        assert.deepEqual(actual, { foo: 'bar' });
        assert.deepEqual(called, ['a', 'b', 'c', 'd', 'e']);
        done();
      });
  });

  it('should return first argument when no functions are in the stack', function (done) {
    var fn = iterator([]);
    fn('foo', 'bar').then(function (actual) {
      assert.equal(actual, 'foo');
      done();
    });
  });

  it('should still execute the functions when the stack only contains one function', function (done) {
    var called = [];
    var stack = getStack(called).slice(0, 1);
    iterator(stack)('foo', 'bar')
      .then(function (actual) {
        assert.deepEqual(actual, { foo: 'bar' });
        assert.deepEqual(called, ['a']);
        done();
      });
  });
});

function getStack (called) {
  var stack = [
    Promise.method(function a (key, value) {
      called.push('a');
      var obj = {};
      obj[key] = value;
      return obj;
    }),
    Promise.method(function b (obj) { called.push('b'); return obj; }),
    Promise.method(function c (obj) { called.push('c'); return obj; }),
    Promise.method(function d (obj) { called.push('d'); return obj; }),
    Promise.method(function e (obj) { called.push('e'); return obj; })
  ];
  return stack;
}
