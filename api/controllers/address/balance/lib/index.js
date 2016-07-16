'use strict';

const co = require('*common/coroutine');
const dbkeys = require('*common/database/keys');
const dbpaths = require('*common/database/paths');

module.exports = {
  getLatestAddressTransaction: co(getLatestAddressTransaction),
  getTransactionOutput: co(getTransactionOutput)
};

/**
 *
 */
function * getLatestAddressTransaction({ db, address }) {
  let latestTransactionPath = dbpaths.address.transaction.latest();

  let latestTransaction = yield db.read({
    key: dbkeys.address.transactions.latest({address}),
    paths: {get: [latestTransactionPath]}
  });

  latestTransaction.value = latestTransaction.value[latestTransactionPath];
  return latestTransaction;
}

/**
 *
 */
function * getTransactionOutput({db, hash, index}) {
  let outputIndexPath = dbpaths.transaction.output({index});

  let output = (yield db.read({
    key: dbkeys.transaction.record({hash}),
    paths: {get: [outputIndexPath]}
  })).value[outputIndexPath];

  return output;
}
