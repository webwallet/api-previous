'use strict';

const {
  getLatestAddressTransaction
} = require('*controllers/address/balance/lib');

/**
 *
 */
function * getTransactionPointers({ db, addresses }) {
  let transactionPointers = (yield addresses.map(address => {
    return getLatestAddressTransaction({db, address});
  })).map(transaction => transaction.value);

  for (let index in transactionPointers) {
    let pointer = transactionPointers[index];
    // pending: validate transaction pointer
    if (typeof pointer.hash !== 'string') {
      let error = new Error();
      error.name = 'missing-transaction-pointer';
      error.values = {address: addresses[index]};
      throw error;
    }
  }

  return transactionPointers;
}

module.exports = getTransactionPointers;
