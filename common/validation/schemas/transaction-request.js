'use strict';

const joi = require('joi');

const values = require('./values.json');

const input = require('./transaction-input');
const jwsHash = require('./jws-hash');
const jwsSignatures = require('./jws-signatures')('transaction-request');

const schemas = {
  jwsHash,
  input,
  jwsSignatures
};

/* Transaction Request Data */
const transactionRequestData = joi.object().keys({
  /* Instructions for transferring currency units between addresses */
  inputs: joi.array().items(schemas.input)
    .min(values.items.inputs.min).max(values.items.inputs.max).required()
});

/* Transaction Record */
const schema = joi.object().keys({
  hash: schemas.jwsHash,
  data: transactionRequestData.required(),
  sigs: schemas.jwsSignatures
    .min(0).max(values.items.confirmations.max)
});

module.exports = schema;
