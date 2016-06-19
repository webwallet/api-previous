'use strict';

const joi = require('joi');

const values = require('./values.json');

const walletAddress = require('./wallet-address');
const bigNumber = require('./big-number');
const previousTransaction = require('./transaction-previous');

const schemas = {
  walletAddress,
  bigNumber,
  previousTransaction
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

  /* Hash pointer to the latest transaction the address was involved in */
  previous: joi.alternatives().when('_count', {
    is: 1, then: joi.any().valid(null),
    otherwise: schemas.previousTransaction.required()
  })
});

module.exports = schema;
