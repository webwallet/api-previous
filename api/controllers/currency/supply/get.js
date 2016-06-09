'use strict';

const co = require('*coroutine');

/**
 *
 */
function * getCurrencySupply(message) {
  let db = this.dbs.main;

  return Promise.resolve({
    body: {
      data: {
        supply: '0'
      }
    }
  });
}

module.exports = co(getCurrencySupply);
