'use strict';

const dbkeys = require('*common/database/keys');
const dbpaths = require('*common/database/paths');

module.exports = {
  getLatestAddressTransaction,
  getTransactionOutput
};

/**
 *
 */
function * getLatestAddressTransaction({ db, address }) {
  let latestTransactionPath = dbpaths.address.transaction.pointer(0);

  let {value: {[latestTransactionPath]: latestTransaction}} = yield db.read({
    key: dbkeys.address.transactions.index({address}),
    paths: {get: [latestTransactionPath]}
  });

  return latestTransaction;
}

/**
 *
 */
function * getTransactionOutput({db, hash, index}) {
  let outputIndexPath = dbpaths.transaction.output({index});

  let {value: {[outputIndexPath]: output}} = yield db.read({
    key: dbkeys.transaction.record({hash}),
    paths: {get: [outputIndexPath]}
  });

  return output;
}
