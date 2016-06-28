'use strict';

const joi = require('joi');

const values = require('./values.json');

const hashObject = require('./hash-object');
const bigNumber = require('./big-number');
const currencyConfig = require('./currency-config');
const previousConfig = require('./config-previous');
const transactionInput = require('./transaction-input');
const transactionOutput = require('./transaction-output');
const dataSignatures = require('./data-signatures')('transaction-record');

const schemas = {
  hashObject,
  bigNumber,
  currencyConfig,
  previousConfig,
  transactionInput,
  transactionOutput,
  dataSignatures
};

const currencyKeysBigNumberValues = joi.object()
  .min(values.items.amount.min).max(values.items.amount.max);

/* Transaction Record Data */
const transactionRecordData = joi.object().keys({
  /* Total number of transferred currency units per currency */
  amount: currencyKeysBigNumberValues
    .pattern(new RegExp(values.regex.currency.code),
      schemas.bigNumber.positive.required()).required(),

  /* Increase or decrease in the overall credit limit per currency */
  credit: currencyKeysBigNumberValues
    .pattern(new RegExp(values.regex.currency.code),
      schemas.bigNumber.all.required()),

  /* Increase or decrease in the currency supply per currency */
  easing: currencyKeysBigNumberValues
    .pattern(new RegExp(values.regex.currency.code),
      schemas.bigNumber.all.required()),

  /* Currency configuration statements, reference to a previous configuration */
  config: joi.alternatives().try([
    schemas.previousConfig,
    joi.array().items(schemas.currencyConfig)
      .min(values.items.configs.min).max(values.items.configs.max)
  ]),

  /* Instructions for transferring currency units between addresses */
  inputs: joi.array().items(schemas.transactionInput)
    .min(values.items.inputs.min).max(values.items.inputs.max),

  /* Resulting balance and limit changes in the involved addresses */
  outputs: joi.array().items(schemas.transactionOutput)
    .min(values.items.outputs.min).max(values.items.outputs.max),
}).xor('inputs', 'config').and('inputs', 'outputs');

const transactionRecordMeta = joi.object().keys({
  /* Transaction ISO date for reference purposes only */
  timestamp: joi.date().iso()
});

/* Transaction Record */
const schema = joi.object().keys({
  hash: schemas.hashObject.required(),
  data: transactionRecordData.required(),
  sigs: schemas.dataSignatures
    .min(0).max(values.items.confirmations.max).required(),
  meta: transactionRecordMeta.required()
});

module.exports = schema;
