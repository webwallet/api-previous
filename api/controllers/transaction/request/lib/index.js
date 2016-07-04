'use strict';

const co = require('*common/coroutine');
const controllers = require('*controllers');

const joi = require('joi');
const schemas = require('*common/validation/schemas');

const {
  getLatestAddressTransaction,
  getTransactionOutput
} = require('*controllers/address/balance/lib');

module.exports = {
  validateRequestBody
};

/**
 *
 */
function validateRequestBody({ body = {} }) {
  const space = ' ';

  return new Promise((resolve, reject) => {
    let options = {abortEarly: false, convert: false};
    joi.validate(body, schemas.transactionRequest, options, (err, value) => {
      let error = {};

      if (err) {
        error.name = 'request-validation-failed';
        error.details = (err.details || []).reduce((values, error) => {
          values[error.path] = values[error.path] ||
            error.message.split(space).slice(1).join(space);
          return values;
        }, {});
        return reject({error});
      }

      return resolve(value);
    });
  });
}
