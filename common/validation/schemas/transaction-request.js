'use strict';

const joi = require('joi');

const values = require('./values.json');

const input = require('./transaction-input');
const hashObject = require('./hash-object');
const dataSignatures = require('./data-signatures')('transaction-request');

const schemas = {
  hashObject,
  input,
  dataSignatures
};

/* Transaction Request Data */
const transactionRequestData = joi.object().keys({
  /* Instructions for transferring currency units between addresses */
  inputs: joi.array().items(schemas.input)
    .min(values.items.inputs.min).max(values.items.inputs.max).required()
});

/* Transaction Record */
const schema = joi.object().keys({
  hash: schemas.hashObject,
  data: transactionRequestData.required(),
  sigs: schemas.dataSignatures
    .min(0).max(values.items.confirmations.max)
});

module.exports = schema;
