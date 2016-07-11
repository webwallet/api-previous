'use strict';

const dbkeys = require('*common/database/keys');

/**
 *
 */
function * getTransactionCounters({ db, currencies }) {
  let counts = (yield currencies.map(currency => {
    return db.read({
      key: dbkeys.currency.transaction.counter({currency})
    });
  }));

  for (let index in counts) {
    let count = counts[index];
    if (typeof count.value !== 'number') {
      let error = new Error();
      error.name = 'missing-transaction-count';
      error.values = {currency: currencies[index]};
      throw error;
    }
  }

  return counts.map(count => count.value)
    .reduce((reduced, count, index) => {
      return (reduced[currencies[index]] = count) && reduced;
    }, {});
}

module.exports = getTransactionCounters;
