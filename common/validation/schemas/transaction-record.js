'use strict';

const joi = require('joi');

const values = require('./values.json');

const input = require('./iou');
const output = require('./transaction-output');
const jwsHash = require('./jws-hash');
const cryptoHash = require('./crypto-hash');
const walletAddress = require('./wallet-address');
const currencyObject = require('./currency-object');
const bigNumber = require('./big-number');
const currencyConfig = require('./currency-config');
const jwsSignatures = require('./jws-signatures')('transaction-record');

const schemas = {
  jwsHash,
  cryptoHash,
  walletAddress,
  currencyObject,
  bigNumber,
  currencyConfig,
  input,
  output,
  jwsSignatures
};

/* JWS Payload */
const transactionRecordPayload = joi.object().keys({
  /* Transaction number/count */
  _count: joi.number().integer().min(0).max(values.counters.transactions),

  /* Total number of transferred currency units */
  amount: schemas.bigNumber.positive.required(),

  /* Attributes of the currency (e.g. code, supply) */
  currency: schemas.currencyObject.required(),

  /* Variation of the currency supply compared to the previous transaction */
  config: joi.alternatives().try([
    joi.number().integer().min(0).less(joi.ref('_count')),
    joi.array().items(schemas.currencyConfig)
      .min(values.items.config.min).max(values.items.config.max)
  ]),

  /* Instructions for transferring currency units between addresses */
  inputs: joi.array().items(schemas.input)
    .min(values.items.inputs.min).max(values.items.inputs.max),

  /* Resulting balance and limit changes in the involved addresses */
  outputs: joi.array().items(schemas.output)
    .min(values.items.outputs.min).max(values.items.outputs.max),

  /* Previous transaction hash */
  previous: schemas.cryptoHash.required(),

  /* Transaction timestamps such as ISO date */
  timestamp: joi.object().keys({
    iso: joi.date().iso().required()
  }).required()
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
