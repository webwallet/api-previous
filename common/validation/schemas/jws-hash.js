'use strict';

const joi = require('joi');

const values = require('./values.json');
const cryptoHash = require('./crypto-hash');

/* JWS Hash */
const schema = joi.object().keys({
  type: joi.string().valid(values.valid.crypto.hashes).required(),
  value: cryptoHash.required()
});

module.exports = schema;
