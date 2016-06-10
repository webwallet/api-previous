'use strict';

const status = require('../status-codes.json');

/**
 *
 */
function handleErrors(error, request, response, next) {
  return response.status(status.badRequest).json({
    errors: [
      {status: status.badRequest, name: 'bad-request', details: error}
    ]
  }).end();
}

module.exports = handleErrors;
