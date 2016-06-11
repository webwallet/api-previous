'use strict';

const co = require('*coroutine');
const tryCatch = require('*common/trycatch');

/**
 *
 */
function * getAddressBalance(message) {
  let db = this.dbs.main;

  return Promise.resolve({
    body: {
      data: {
        balance: '0'
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

module.exports = tryCatch(co(getAddressBalance), exceptionHandler);
