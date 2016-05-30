'use strict';

const joi = require('joi');

const values = require('./values.json');

/* Cryptographic Hash */
const schema = joi.alternatives()
  .try(values.lengths.crypto.hash.map(hashLength => {
    return joi.string().hex().length(hashLength);
  }));

module.exports = schema;
