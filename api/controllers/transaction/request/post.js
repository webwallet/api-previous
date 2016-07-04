'use strict';

const co = require('*coroutine');
const tryCatch = require('*common/trycatch');
const status = require('*common/http/status-codes.json');
const response = require('./response.js');

const {
  validateRequestBody
} = require('./lib');

/**
 *
 */
function * postTransactionRequest(request) {
  let db = this.dbs.main;

  let body = yield validateRequestBody(request.params);
  // validate transaction inputs
  // get transaction count
  // get latest address transactions
  // build transaction outputs
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
