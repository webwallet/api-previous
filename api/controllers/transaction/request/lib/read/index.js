'use strict';

const co = require('*coroutine');

const readTransactionCounters = co(require('./transaction-counters'));
const readTransactionPointers = co(require('./transaction-pointers'));
const readTransactionOutputs = co(require('./transaction-outputs'));

module.exports = {
  previousTransactionsData: co(previousTransactionsData)
};

/**
 *
 */
function * previousTransactionsData({db, addresses, currencies}) {
  let previous = {};

  /* Parse involved addresses and currencies, then retrieve counters, pointers and outputs  */
  previous.counters = yield readTransactionCounters({db, currencies});
  previous.pointers = yield readTransactionPointers({db, addresses});
  previous.outputs = yield readTransactionOutputs({db, addresses, pointers: previous.pointers});

  return previous;
}
