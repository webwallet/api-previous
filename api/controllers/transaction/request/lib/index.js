'use strict';

const co = require('*common/coroutine');

const read = require('./read');
const parse = require('./parse');
const write = require('./write');

const computeTransactionOutputs = require('./computeTransactionOutputs');
const buildTransactionRecord = require('./buildTransactionRecord');
const insertTransactionPointers = require('./insertTransactionPointers');
const insertTransactionRecord = require('./insertTransactionRecord');

const joi = require('joi');
const schemas = require('*common/validation/schemas');

module.exports = {
  read,
  parse,
  write,
  validateRequestBody,
  computeTransactionOutputs,
  buildTransactionRecord,
  insertTransactionPointers: co(insertTransactionPointers),
  insertTransactionRecord: co(insertTransactionRecord)
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
