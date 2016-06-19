'use strict';

const joi = require('joi');

const values = require('./values.json');

const input = require('./iou');
const output = require('./transaction-output');
const jwsHash = require('./jws-hash');
const cryptoHash = require('./crypto-hash');
const bigNumber = require('./big-number');
const currencyConfig = require('./currency-config');
const jwsSignatures = require('./jws-signatures')('transaction-record');

const schemas = {
  jwsHash,
  cryptoHash,
  bigNumber,
  currencyConfig,
  input,
  output,
  jwsSignatures
};

/* JWS Payload */
const transactionRecordPayload = joi.object().keys({
  /* Total number of transferred currency units */
  amount: schemas.bigNumber.positive.required(),

  /* Attributes of the currency (e.g. code, supply) */
  currency: joi.string().alphanum().min(values.lengths.currency.code.min)
    .max(values.lengths.currency.code.max),

  /* Increase or decrease in the currency supply */
  easing: schemas.bigNumber.all.required(),

  /* Variation of the currency supply compared to the previous transaction */
  config: joi.alternatives().try([
    schemas.cryptoHash,
    joi.array().items(schemas.currencyConfig)
      .min(values.items.config.min).max(values.items.config.max)
  ]),

  /* Instructions for transferring currency units between addresses */
  inputs: joi.array().items(schemas.input)
    .min(values.items.inputs.min).max(values.items.inputs.max),

  /* Resulting balance and limit changes in the involved addresses */
  outputs: joi.array().items(schemas.output)
    .min(values.items.outputs.min).max(values.items.outputs.max),

  /* Transaction ISO date for reference purposes only */
  timestamp: joi.date().iso()
}).xor('inputs', 'config').with('inputs', 'outputs');

/* Transaction Record */
const schema = joi.object().keys({
  hash: schemas.jwsHash.required(),
  payload: transactionRecordPayload.required(),
  signatures: schemas.jwsSignatures
    .min(0).max(values.items.confirmations.max).required(),
  confirmations: joi.number().integer()
    .min(0).max(values.items.confirmations.max)
});

module.exports = schema;
