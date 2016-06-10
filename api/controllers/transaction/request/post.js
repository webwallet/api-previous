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

module.exports = co(postTransactionRequest);
