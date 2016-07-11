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
  computeTransactionOutputs,
  buildTransactionRecord,
  insertTransactionPointers,
  insertTransactionRecord
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

  /* Parse involved addresses and currencies, then retrieve counters, pointers and outputs  */
  let addresses = parseTransactionAddresses({db, transaction: body.data});
  let currencies = parseTransactionCurrencies({db, transaction: body.data});
  previous.counters = yield getTransactionCounters({db, currencies});
  previous.pointers = yield getTransactionPointers({db, addresses});
  previous.outputs = yield getTransactionOutputs({db, addresses, pointers: previous.pointers});

  /* Compute transaction outputs and build transaction record */
  let computeOutputsParams = {db, addresses, currencies, inputs, previous};
  let outputs = transaction.outputs = computeTransactionOutputs(computeOutputsParams);
  let record = buildTransactionRecord({transaction});

  /* Insert transaction pointers in all addresses' indexes and insert transaction record */
  let pointersParams = {db, addresses, outputs, hash: record.hash.val};
  let pointersResult = yield insertTransactionPointers(pointersParams);
  let recordResult = yield insertTransactionRecord({db, currencies, previous, record});

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
