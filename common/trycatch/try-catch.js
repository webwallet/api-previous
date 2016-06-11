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
  let context = this;

  return co(function * tryCatched(...args) {
    try {
      return yield runStatements.apply(context, args);
    } catch (exception) {
      if (exception && exception.name in throwExceptions) {
        throw exception;
      }

      return yield exceptionHandler(exception);
    }
  });
}

module.exports = tryCatch;
