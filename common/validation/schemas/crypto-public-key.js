'use strict';

const joi = require('joi');

const publicKeyLengths = require('./values.json').lengths.crypto.publicKey;

/* Cryptographic signature */
const schema = joi.alternatives().try(publicKeyLengths.map(length => {
  return joi.string().hex().length(length);
}));

module.exports = schema;
