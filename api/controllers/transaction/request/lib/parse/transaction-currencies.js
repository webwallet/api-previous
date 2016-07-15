'use strict';

const config = require('*config');

/**
 *
 */
function parseTransactionCurrencies({ db, transaction }) {
  let currencies = Object.keys(transaction.inputs.map(input => input.data.cur)
    .reduce((reduced, key) => (reduced[key] = true) && reduced, {}));

  if (currencies.length > config.max.currenciesPerTransaction) {
    let error = new Error();
    error.name = 'too-many-currencies';
    error.values = {currencies};
    throw error;
  }

  return currencies;
}

module.exports = parseTransactionCurrencies;
