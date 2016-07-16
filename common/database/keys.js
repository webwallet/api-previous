'use strict';

module.exports = {
  address: {
    transactions: {
      latest: ({ address }) => {
        return `adr::${address}::txs::latest`;
      }
    }
  },
  currency: {
    transaction: {
      counter: ({ currency }) => {
        return `cur::${currency}::txs`;
      }
    }
  },
  transaction: {
    record: ({ hash }) => {
      return `txn::${hash}`;
    }
  }
};
