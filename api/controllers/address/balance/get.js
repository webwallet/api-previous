'use strict';

const co = require('*coroutine');
const tryCatch = require('*common/trycatch');
const status = require('*common/http/status-codes.json');
const response = require('./response.js');

const {
  getLatestAddressTransaction,
  getTransactionOutput
} = require('./lib');

/**
 *
 */
function * getAddressBalance(request) {
  let db = this.dbs.main;

  let address = request.params.address;
  let latestTransaction = yield * getLatestAddressTransaction({db, address});
  let [hash, index] = latestTransaction.split(':');
  let latestOutput = yield * getTransactionOutput({db, hash, index});

  return response.get({
    balance: latestOutput.balance,
    limits: latestOutput.limits
  });
}

/**
 *
 */
function exceptionHandler(exception, request) {
  let error = {name: '', values: {}};
  let response = {};
  let keyType;
  let keyID;

  switch (exception.name) {
  case 'key-not-found':
    [keyType, keyID] = exception.values.key.split('::');
    if (keyType === 'adr') {
      error.name = 'address-not-found';
      error.values.address = request.params.address;
    } else if (keyType === 'tra') {
      error.name = 'transaction-not-found';
      error.values.transaction = keyID;
    }
    response.status = status.notFound;
    response.body = {errors: [error]};
    break;
  default:
    response.status = status.internalServerError;
    response.body = {
      errors: exception instanceof Array ? exception : [exception]
    };
    break;
  }

  return response;
}

module.exports = tryCatch(co(getAddressBalance), exceptionHandler);
