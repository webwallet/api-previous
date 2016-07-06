'use strict';

const co = require('*coroutine');
const tryCatch = require('*common/trycatch');
const status = require('*common/http/status-codes.json');
const response = require('./response.js');

const {
  validateRequestBody,
  parseTransactionAddresses,
  parseTransactionCurrencies,
  getTransactionCounters,
  getTransactionPointers,
  getTransactionOutputs,
  computeTransactionOutputs
} = require('./lib');

/**
 *
 */
function * postTransactionRequest(request) {
  let db = this.dbs.main;
  let transaction = {};
  let previous = {};

  let body = yield validateRequestBody(request.params);
  let inputs = transaction.inputs = body.data.inputs;
  // validate that transaction inputs have not been cleared before

  let addresses = parseTransactionAddresses({db, transaction: body.data});
  let currencies = parseTransactionCurrencies({db, transaction: body.data});
  previous.counters = yield getTransactionCounters({db, currencies});
  previous.pointers = yield getTransactionPointers({db, addresses});
  previous.outputs = yield getTransactionOutputs({db, addresses, pointers: previous.pointers});

  let computeOutputsParams = {db, addresses, currencies, inputs, previous};
  transaction.outputs = computeTransactionOutputs(computeOutputsParams);
  // create transaction record

  return response.post(body);
}

/**
 *
 */
function exceptionHandler(exception, request) {
  let error = {name: '', values: {}};
  let response = {};

  switch (exception.name) {
  case 'request-validation-failed':
    response.status = status.badRequest;
    response.body = {errors: [exception]};
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

module.exports = tryCatch(co(postTransactionRequest), exceptionHandler);
