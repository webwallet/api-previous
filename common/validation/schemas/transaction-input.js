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

  /* (amount) Number of units to transfer when clearing the IOU */
  amt: schemas.bigNumber.positive.required(),

  /* (allowance) Number of lower limit units to grant as credit */
  alw: schemas.bigNumber.positive,

  /* (currency) Unit of account identifier in which the IOU is denominated */
  cur: joi.string().alphanum().min(values.lengths.currency.code.min)
    .max(values.lengths.currency.code.max).required(),

  /* (nonce) Random value to prevent replay attacks */
  nce: joi.string().max(values.lengths.iou.nce.max),

  /* Information about the IOU */
  ref: [
    joi.string().hex().max(values.lengths.iou.ref.max),
    joi.number().integer().min(0)
  ],

  /* IOU issuance date */
  iat: joi.date().iso().max('now').options({convert: true}),

  /* IOU threshold date */
  nbf: joi.date().iso().options({convert: true})
    .when('iat', {is: joi.date().iso().required(),
      then: joi.date().iso().min(joi.ref('iat'))}),

  /* IOU expiration date */
  exp: joi.date().iso().required().options({convert: true})
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
