'use strict';

const joi = require('joi');

const values = require('./values.json');

/* Previous Transaction Pointer */
const schema = joi.object().keys({
  /* Previous configuration index */
  cfg: joi.number().integer().min(1).max(values.items.configs.max).required(),
  /* Previous transaction hash */
  tra: joi.string().hex().required()
    .min(values.lengths.crypto.hash.min).max(values.lengths.crypto.hash.max)
});

module.exports = schema;
