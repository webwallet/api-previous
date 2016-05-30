'use strict';
/* eslint-disable consistent-return */

const P = require('bluebird');
const bluebirdCoroutine = P.coroutine;

bluebirdCoroutine.addYieldHandler(values => {
  if (values instanceof Array) {
    return P.settle(values).map(promise => {
      return promise.isFulfilled() ? promise.value() : promise.reason();
    });
  }
  if (values instanceof Object) {
    let keys = Object.keys(values);

    return P.settle(keys.map(key => values[key]))
      .reduce((reduced, promise, index) => {
        reduced[keys[index]] = promise.isFulfilled() ?
          promise.value() : promise.reason();
        return reduced;
      }, {});
  }
  if (typeof values === 'number') {
    return P.delay(values);
  }
});

module.exports = bluebirdCoroutine;
