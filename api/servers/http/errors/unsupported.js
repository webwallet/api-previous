'use strict';

const logger = require('*logger').api;
const status = require('../status-codes.json');

/**
 *
 */
function unsupported(request, response, next) {
  logger.info(`Unsupported request: ${request.method} ${request.path}`);
  response.status(status.methodNotAllowed).json({
    errors: [
      {status: status.methodNotAllowed, name: 'unsupported-request'}
    ]
  }).end();
}

module.exports = unsupported;
