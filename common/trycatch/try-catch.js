'use strict';

const co = require('*coroutine');

const throwExceptions = [
  'TypeError',
  'ReferenceError'
].reduce((reduced, key) => (reduced[key] = true) && reduced, {});

/**
 *
 */
function tryCatch(runStatements, exceptionHandler) {
  return co(function * tryCatched(...args) {
    try {
      return yield runStatements.apply(this, args);
    } catch (exception) {
      if (exception && exception.name in throwExceptions) {
        throw exception;
      }

      return yield exceptionHandler
        .apply(this, [exception.error || exception, ...args]);
    }
  });
}

module.exports = tryCatch;
