'use strict';

const joi = require('joi');

const values = require('./values.json');

const walletAddress = require('./wallet-address');
const bigNumber = require('./big-number');
const transactionPointer = require('./transaction-pointer');

const schemas = {
  walletAddress,
  bigNumber,
  transactionPointer
};

/* Transaction Output */
const schema = joi.object().keys({
  /* Address transaction count */
  _count: joi.number().integer().min(0).max(values.counters.transactions),

  /* Wallet address */
  address: schemas.walletAddress.required(),

  /* Variation of the balance compared to the previous transaction */
  amount: schemas.bigNumber.all.required(),

  /* Resulting sum of all incoming and outgoing transactions */
  balance: schemas.bigNumber.all.required(),

  /* Minimum and maximum values that the balance property can take */
  limits: joi.object().keys({
    lower: joi.alternatives().try([
      schemas.bigNumber.all,
      joi.string().valid('-Infinity')
    ]).required(),
    upper: joi.alternatives().try([
      schemas.bigNumber.all,
      joi.string().valid('Infinity')
    ]).required()
  }).required(),

  /* Pointer to the latest transaction in which the address was involved */
  previous: schemas.transactionPointer.required()
});

module.exports = schema;
