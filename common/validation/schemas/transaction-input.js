'use strict';

const joi = require('joi');

const values = require('./values.json');
const hashObject = require('./hash-object');
const dataSignatures = require('./data-signatures')('iou');
const walletAddress = require('./wallet-address');
const bigNumber = require('./big-number');

const schemas = {
  hashObject,
  dataSignatures,
  walletAddress,
  bigNumber
};

/* Transaction Input Data */
const transactionInputData = joi.object().keys({
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
  amt: schemas.bigNumber.positive.required(),

  /* Number of lower limit units to grant as credit */
  alw: schemas.bigNumber.positive,

  /* Unit of account in which the IOU is denominated */
  unt: joi.string().alphanum().required(),

  /* Nonce to prevent replay attacks */
  nce: joi.string().max(values.lengths.iou.nce.max),

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
  exp: joi.date().iso().required()
    .when('iat', {is: joi.date().iso().required(),
      then: joi.date().iso().min(joi.ref('iat'))})
    .when('nbf', {is: joi.date().iso().required(),
      then: joi.date().iso().min(joi.ref('nbf'))})
});

const schema = joi.object().keys({
  hash: schemas.hashObject.required(),
  data: transactionInputData.required(),
  sigs: schemas.dataSignatures.required()
});

module.exports = schema;
