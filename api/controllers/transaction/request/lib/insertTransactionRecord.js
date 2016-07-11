'use strict';

const dbkeys = require('*common/database/keys');

/**
 *
 */
function * insertTransactionRecord({ db, currencies, previous, record }) {
  /* Insert transaction record under a key built using its hash */
  let key = dbkeys.transaction.record({hash: record.hash.val});
  let transactionRecordResult = yield db.create({key, value: record});

  /* Increase transaction counters for every currency */
  for (let currency of currencies) {
    let key = dbkeys.currency.transaction.counter({currency});
    let counterUpdate = yield db.update({key, counter: true});
  }

  return;
}

module.exports = insertTransactionRecord;
