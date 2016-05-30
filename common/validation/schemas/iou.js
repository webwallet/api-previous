'use strict';

const joi = require('joi');

const values = require('./values.json');
const jwsHash = require('./jws-hash');
const jwsSignatures = require('./jws-signatures')('iou');
const walletAddress = require('./wallet-address');
const bigNumber = require('./big-number');
const minPublicKeys = 1;

const schemas = {
  jwsHash,
  jwsSignatures,
  walletAddress,
  bigNumber
};

const payload = joi.object().keys({
  /* Service in which the IOU can be cleared */
  iss: joi.string().uri().max(values.lengths.iou.iss.max),

  /* Type of IOU */
  // typ: joi.string().alphanum().valid(values.valid.iou.typ),

  /* Subject that issued the IOU */
  sub: schemas.walletAddress.required(),

  /* Audience authorized to claim the IOU */
  aud: joi.alternatives().try([
    schemas.walletAddress,
    // joi.array().items(schemas.walletAddress).unique()
    //   .max(values.items.iou.aud.max).invalid(joi.ref('sub')),
    joi.string().valid('*')
  ]).invalid(joi.ref('sub')).required(),

  /* Number of units to transfer when clearing the IOU */
  num: schemas.bigNumber.positive.required(),

  /* Unit of account in which the IOU is denominated */
  iou: joi.string().alphanum().required(),

  /* Nonce to prevent replay attacks */
  nce: joi.string().max(values.lengths.iou.nce.max).required(),

  /* Number of units to add to the lower limit */
  lim: schemas.bigNumber.all,

  /* Information about the IOU */
  ref: [
    joi.number().integer().min(0),
    joi.string().hex().max(values.lengths.iou.ref.max)
  ],

  /* IOU issuance date */
  iat: joi.date().iso().max('now'),

  /* IOU threshold date */
  nbf: joi.date().iso()
    .when('iat', {is: joi.date().iso().required(),
      then: joi.date().iso().min(joi.ref('iat'))}),

  /* IOU expiration date */
  exp: joi.date().iso()
    .when('iat', {is: joi.date().iso().required(),
      then: joi.date().iso().min(joi.ref('iat'))})
    .when('nbf', {is: joi.date().iso().required(),
      then: joi.date().iso().min(joi.ref('nbf'))})
});

const schema = joi.object().keys({
  hash: schemas.jwsHash.required(),
  payload: payload.required(),
  signatures: schemas.jwsSignatures
    .min(minPublicKeys).max(values.items.publicKeys.max).required()
});

module.exports = schema;
