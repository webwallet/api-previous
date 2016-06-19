'use strict';

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
    response = {key, path, details: exception};
    break;
  }

  return response;
}

module.exports = {
  check: checkForExceptions,
  handle: handleException
};
