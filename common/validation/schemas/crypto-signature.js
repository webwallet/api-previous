'use strict';

const joi = require('joi');

const signatureLength = require('./values.json').lengths.crypto.signature;

/* Cryptographic signature */
const schema = joi.string().hex()
  .min(signatureLength.min).max(signatureLength.max);

module.exports = schema;
