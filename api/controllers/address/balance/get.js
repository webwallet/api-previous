'use strict';

const co = require('*coroutine');

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

module.exports = co(getAddressBalance);
