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
      count: ({ currency }) => {
        return `cur::${currency}::tra`;
      }
    }
  },
  transaction: {
    record: ({ hash }) => {
      return `tra::${hash}`;
    }
  }
};
