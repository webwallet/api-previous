'use strict';

module.exports = {
  address: {
    transactions: {
      index: ({ address }) => {
        return `adr::${address}::txs`;
      }
    }
  },
  transaction: {
    record: ({ hash }) => {
      return `tra::${hash}`;
    }
  }
};
