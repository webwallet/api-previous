'use strict';

const co = require('*coroutine');
const tryCatch = require('*common/trycatch');
const status = require('*common/http/status-codes.json');
const response = require('./response.js');

const {
  parse,
  read,
  validateRequestBody,
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

  let body = yield validateRequestBody(request.params);
  let inputs = transaction.inputs = body.data.inputs;
  // validate that transaction inputs have not been cleared before

  /* Get previous transaction data */
  let addresses = yield parse.transactionAddresses({db, transaction: body.data});
  let currencies = yield parse.transactionCurrencies({db, transaction: body.data});
  let previous = yield read.previousTransactionsData({db, addresses, currencies});

  /* Compute transaction outputs and build transaction record */
  let computeOutputsParams = {db, addresses, currencies, inputs, previous};
  let outputs = transaction.outputs = computeTransactionOutputs(computeOutputsParams);
  let record = buildTransactionRecord({transaction});

  /* Insert transaction pointers in all addresses' indexes and insert transaction record */
  let pointersParams = {db, addresses, outputs, hash: record.hash.val};
  let pointersResult = yield insertTransactionPointers(pointersParams);
  let recordResult = yield insertTransactionRecord({db, currencies, previous, record});

  return response.post(recordResult);
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
