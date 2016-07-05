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
  getTransactionCurrencies,
  getTransactionCounts: co(getTransactionCounts)
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
function getTransactionCurrencies({ db, body }) {
  let currencies = Object.keys(body.data.inputs.map(iou => iou.data.cur)
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
function * getTransactionCounts({ db, currencies }) {
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
