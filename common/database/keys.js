'use strict';

module.exports = {
  address: {
    transactions: {
      index: ({ address }) => {
        return `adr::${address}::txs`;
      }
    }
  },
  currency: {
    transaction: {
      counter: ({ currency }) => {
        return `cur::${currency}::txn`;
      }
    }
  },
  transaction: {
    record: ({ hash }) => {
      return `txn::${hash}`;
    }
  }
};
