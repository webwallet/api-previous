'use strict';

const logger = require('*logger');
const errorCodes = require('./error-codes.json');
/**
 *
 */
function checkForExceptions({ key, data }) {
  if (data.error) {
    if (typeof data.error === 'number') {
      let error = Object.keys(data.value).map(path => {
        return handleException({key, path, exception: data.value[path]});
      }).filter(error => error.name);
      return {error};
    }
    return handleException({key, exception: data.error});
  }
  return data;
}

/**
 *
 */
function handleException({ key, path, exception }) {
  let error = {name: '', values: {key, path}};
  let response = {error};

  switch (exception.code) {
  case errorCodes.keyNotFound:
    error.name = 'key-not-found';
    break;
  case errorCodes.networkFailure:
    error.name = 'network-failure';
    break;
  case errorCodes.databaseTimeout:
    error.name = 'database-timeout';
    break;
  case errorCodes.pathNotFound:
    error.name = 'path-not-found';
    response = error;
    break;
  case errorCodes.noCommands:
    error.name = 'missing-path-commands';
    break;
  case errorCodes.subTypeMismatch:
    error.name = 'subdocument-type-mismatch';
    response = error;
    break;
  default:
    error.name = 'internal-server-error';
    logger.db.error({key, path, error, details: exception});
    break;
  }

  return response;
}

module.exports = {
  check: checkForExceptions,
  handle: handleException
};
