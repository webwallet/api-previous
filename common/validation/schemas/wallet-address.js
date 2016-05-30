'use strict';

const joi = require('joi');

const values = require('./values.json');

/* Wallet Address */
const schema = joi.string().alphanum()
  .min(values.lengths.address.min).max(values.lengths.address.max);

module.exports = schema;
