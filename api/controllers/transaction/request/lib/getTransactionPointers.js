'use strict';

const {
  getLatestAddressTransaction
} = require('*controllers/address/balance/lib');

/**
 *
 */
function * getTransactionPointers({ db, addresses }) {
  let transactionPointers = yield addresses.map(address => {
    return getLatestAddressTransaction({db, address});
  });

  for (let index in transactionPointers) {
    let pointer = transactionPointers[index];
    if (typeof pointer !== 'string') {
      let error = new Error();
      error.name = 'missing-transaction-pointer';
      error.values = {address: addresses[index]};
      throw error;
    }
  }

  return transactionPointers;
}

module.exports = getTransactionPointers;
