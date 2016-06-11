'use strict';

const co = require('*coroutine');

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

module.exports = {
  controller: co(postTransactionRequest),
  exceptionHandler
};
