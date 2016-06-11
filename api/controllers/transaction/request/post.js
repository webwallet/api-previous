'use strict';

const co = require('*coroutine');
const tryCatch = require('*common/trycatch');

/**
 *
 */
function * postTransactionRequest(message) {
  let db = this.dbs.main;

  return Promise.resolve({
    body: {
      data: {
        status: 'pending'
      }
    }
  });
}

/**
 *
 */
function exceptionHandler(exception) {
  return {
    body: {errors: [exception]}
  };
}

module.exports = tryCatch(co(postTransactionRequest), exceptionHandler);
