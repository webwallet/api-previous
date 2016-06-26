'use strict';

const status = require('*common/http/status-codes.json');

/**
 *
 */
function handleErrors(error, request, response, next) {
  let err = {status: status.badRequest, name: 'bad-request', details: {}};
  if (error.body) err.details.body = 'invalid-json';
  return response.status(status.badRequest).json({errors: [err]}).end();
}

module.exports = handleErrors;
