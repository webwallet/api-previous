'use strict';

const co = require('*common/coroutine');
const dbkeys = require('*common/database/keys');
const dbpaths = require('*common/database/paths');
const config = require('*config');

const joi = require('joi');
const schemas = require('*common/validation/schemas');

const {
  getLatestAddressTransaction,
  getTransactionOutput
} = require('*controllers/address/balance/lib');

module.exports = {
  validateRequestBody,
  parseTransactionAddresses,
  parseTransactionCurrencies,
  getTransactionCounters: co(getTransactionCounters),
  getTransactionPointers: co(getTransactionPointers)
};

/**
 *
 */
function validateRequestBody({ body = {} }) {
  const space = ' ';

  return new Promise((resolve, reject) => {
    let options = {abortEarly: false, convert: false};
    joi.validate(body, schemas.transactionRequest, options, (err, value) => {
      let error = {};

      if (err) {
        error.name = 'request-validation-failed';
        error.details = (err.details || []).reduce((values, error) => {
          values[error.path] = values[error.path] ||
            error.message.split(space).slice(1).join(space);
          return values;
        }, {});
        return reject({error});
      }

      return resolve(value);
    });
  });
}


/**
 *
 */
function parseTransactionAddresses({ db, transaction }) {
  // Parse addresses from transaction inputs and ignore repeated values
  let addresses = Object.keys(transaction.inputs.map(({data: {sub, aud}}) => {
    return [sub, ...(aud instanceof Array ? aud : [aud])];
  }).reduce((a, b) => a.concat(b))
  .reduce((reduced, key) => (reduced[key] = true) && reduced, {}));

  if (addresses.length > config.max.addressesPerTransaction) {
    let error = new Error();
    error.name = 'too-many-addresses';
    error.values = {addresses};
    throw error;
  }

  return addresses;
}

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

/**
 *
 */
function * getTransactionCounters({ db, currencies }) {
  let counts = (yield currencies.map(currency => {
    return db.read({
      key: dbkeys.currency.transaction.count({currency})
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

/**
 *
 */
function * getTransactionPointers({ db, addresses }) {
  let transactionPointers = yield addresses.map(address => {
    return getLatestAddressTransaction({db, address});
  });

  for (let index in transactionPointers) {
    let pointer = transactionPointers[index];
    if (typeof pointer !== 'string') {
      let error = new Error();
      error.name = 'missing-transaction-pointer';
      error.values = {address: addresses[index]};
      throw error;
    }
  }

  return transactionPointers;
}
