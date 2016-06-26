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

  switch (type) {
  case 'address-statement':
    schema = joi.array().items({
      header: joi.object().keys({
        alg: joi.string().valid(signatureAlgorithms).required(),
        kid: joi.number().integer()
          .min(minPublicKeys).max(maxPublicKeys - 1).required()
      }).required(),
      signature: schemas.cryptoSignature.required()
    }).unique();
    break;
  case 'iou':
    schema = joi.array().items({
      header: joi.object().keys({
        alg: joi.string().valid(signatureAlgorithms).required(),
        wid: schemas.walletAddress,
        key: schemas.cryptoPublicKey,
        kid: joi.number().integer()
          .min(minPublicKeys).max(maxPublicKeys - 1)
      }).or('wid', 'key').with('kid', 'wid').required(),
      signature: schemas.cryptoSignature.required()
    }).unique();
    break;
  case 'transaction-request':
    schema = joi.array().items({
      header: joi.object().keys({
        alg: joi.string().valid(signatureAlgorithms).required(),
        wid: schemas.walletAddress.required(),
        key: schemas.cryptoPublicKey.required(),
        kid: joi.number().integer()
          .min(minPublicKeys).max(maxPublicKeys - 1),
        uri: joi.string().uri().max(values.lengths.uri.max).required()
      }).required(),
      signature: schemas.cryptoSignature.required()
    }).unique();
    break;
  case 'transaction-record':
    schema = joi.array().items({
      header: joi.object().keys({
        alg: joi.string().valid(signatureAlgorithms).required(),
        wid: schemas.walletAddress.required(),
        key: schemas.cryptoPublicKey.required(),
        kid: joi.number().integer()
          .min(minPublicKeys).max(maxPublicKeys - 1),
        uri: joi.string().uri().max(values.lengths.uri.max).required()
      }).required(),
      signature: schemas.cryptoSignature.required()
    }).unique();
    break;
  default:
    schema = joi.array().items({
      header: joi.object().keys({
        alg: joi.string().valid(signatureAlgorithms).required(),
        wid: schemas.walletAddress,
        key: schemas.cryptoPublicKey,
        kid: joi.number().integer()
          .min(minPublicKeys).max(maxPublicKeys - 1)
      }).or('wid', 'key').with('kid', 'wid').required(),
      signature: schemas.cryptoSignature.required()
    }).unique();
    break;
  }

  return schema;
}

module.exports = getJwsSignaturesSchema;
