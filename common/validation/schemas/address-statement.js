'use strict';

const joi = require('joi');

const values = require('./values.json');
const minPublicKeys = 1;
const maxPublicKeys = values.items.publicKeys.max;

const hashObject = require('./hash-object');
const walletAddress = require('./wallet-address');
const cryptoPublicKey = require('./crypto-public-key');
const dataSignatures = require('./data-signatures')('address-statement');

const schemas = {
  hashObject,
  walletAddress,
  cryptoPublicKey,
  dataSignatures
};

const payload = joi.object().keys({
  /* Wallet address derived from the merkle root of the public keys */
  address: schemas.walletAddress.required(),

  /* Public keys to be used for verifying cryptographic signatures */
  keys: joi.array().items(schemas.cryptoPublicKey).unique()
    .min(minPublicKeys).max(maxPublicKeys).required(),

  /* Minimum number of required signatures to authorize a transaction */
  threshold: joi.number().integer()
    .min(minPublicKeys).max(maxPublicKeys).required()
}).assert('p.keys.length', joi.ref('s.length'));

const schema = joi.object().keys({
  hash: schemas.hashObject.required(),
  payload: payload.required(),
  signatures: schemas.dataSignatures
    .min(minPublicKeys).max(maxPublicKeys).required()
});

module.exports = schema;
