'use strict';

const joi = require('joi');

const values = require('./values.json');
const cryptoHash = require('./crypto-hash');

const schemas = {
  cryptoHash
};

/* Previous Transaction Pointer */
const schema = joi.object().keys({
  /* Previous output index */
  index: joi.number().integer().min(1).max(values.items.outputs.max).required(),
  /* Previous transaction hash */
  hash: schemas.cryptoHash.required()
});

module.exports = schema;
