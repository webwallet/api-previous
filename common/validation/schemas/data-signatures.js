'use strict';

const joi = require('joi');

const values = require('./values.json');
const signatureAlgorithms = values.valid.crypto.signatureAlgorithms;
const maxPublicKeys = values.items.publicKeys.max;
const minPublicKeys = 0;

const walletAddress = require('./wallet-address');
const cryptoSignature = require('./crypto-signature');
const cryptoPublicKey = require('./crypto-public-key');

const schemas = {
  walletAddress,
  cryptoSignature,
  cryptoPublicKey
};

/**
 *
 */
function getJwsSignaturesSchema(type) {
  let schema;
  let item;

  switch (type) {
  case 'address-statement':
    schema = joi.object().keys({
      alg: joi.string().valid(signatureAlgorithms)
        .default(signatureAlgorithms[0]),
      kid: joi.number().integer().required()
        .min(minPublicKeys).max(maxPublicKeys - 1),
      sig: schemas.cryptoSignature.required()
    });
    break;
  case 'iou':
    item = joi.object().keys({
      alg: joi.string().valid(signatureAlgorithms)
        .default(signatureAlgorithms[0]),
      wid: schemas.walletAddress,
      key: schemas.cryptoPublicKey,
      kid: joi.number().integer()
        .min(minPublicKeys).max(maxPublicKeys - 1),
      sig: schemas.cryptoSignature.required()
    }).or('wid', 'key').with('kid', 'wid');
    schema = joi.alternatives().try([
      item,
      joi.array().items(item).unique()
        .min(1).max(values.items.publicKeys.max)
    ]);
    break;
  case 'transaction-request':
    schema = joi.object().keys({
      alg: joi.string().valid(signatureAlgorithms)
        .default(signatureAlgorithms[0]),
      wid: schemas.walletAddress.required(),
      key: schemas.cryptoPublicKey.required(),
      kid: joi.number().integer()
        .min(minPublicKeys).max(maxPublicKeys - 1),
      uri: joi.string().uri().max(values.lengths.uri.max).required(),
      sig: schemas.cryptoSignature.required()
    }).with('kid', 'wid');
    break;
  case 'transaction-record':
    item = joi.object().keys({
      alg: joi.string().valid(signatureAlgorithms)
        .default(signatureAlgorithms[0]),
      wid: schemas.walletAddress.required(),
      key: schemas.cryptoPublicKey.required(),
      kid: joi.number().integer()
        .min(minPublicKeys).max(maxPublicKeys - 1),
      uri: joi.string().uri().max(values.lengths.uri.max).required(),
      sig: schemas.cryptoSignature.required()
    }).with('kid', 'wid');
    schema = joi.array().items(item).unique();
    break;
  default:
    item = joi.object().keys({
      alg: joi.string().valid(signatureAlgorithms)
        .default(signatureAlgorithms[0]),
      wid: schemas.walletAddress,
      key: schemas.cryptoPublicKey,
      kid: joi.number().integer()
        .min(minPublicKeys).max(maxPublicKeys - 1),
      sig: schemas.cryptoSignature.required()
    }).or('wid', 'key').with('kid', 'wid');
    schema = joi.alternatives().try([
      item,
      joi.array().items(item).unique()
        .min(1).max(values.items.publicKeys.max)
    ]);
    break;
  }

  return schema;
}

module.exports = getJwsSignaturesSchema;
