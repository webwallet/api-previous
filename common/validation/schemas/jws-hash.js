'use strict';

const joi = require('joi');

const values = require('./values.json');
const hashLengths = values.lengths.crypto.hash;

/* JWS Hash */
const schema = joi.object().keys({
  alg: joi.string().valid(values.valid.crypto.hashes)
    .default(values.valid.crypto.hashes[0]),
  typ: joi.string().valid(values.valid.crypto.hashTypes)
    .default(values.valid.crypto.hashTypes[0]),
  val: joi.string().hex().required()
    .when('alg', {is: 'sha256', then: joi.string().length(hashLengths.sha256)})
    .when('alg', {is: 'sha512', then: joi.string().length(hashLengths.sha512)})
});

module.exports = schema;
