'use strict';

const {
  getTransactionOutput
} = require('*controllers/address/balance/lib');

/**
 *
 */
function * getTransactionOutputs({ db, addresses, pointers }) {
  let transactionOutputs = yield pointers.map(pointer => {
    let [hash, index] = pointer.split(':');
    return getTransactionOutput({db, hash, index});
  });

  for (let index in transactionOutputs) {
    let output = transactionOutputs[index];
    if (output.error) {
      let error = new Error();
      error.name = 'missing-transaction-output';
      error.values = {address: addresses[index], pointer: pointers[index]};
      throw error;
    }
  }

  return transactionOutputs;
}

module.exports = getTransactionOutputs;
