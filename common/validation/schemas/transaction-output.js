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
  _tx: joi.number().integer().min(0).max(values.counters.transactions),

  /* (address) Wallet address */
  adr: schemas.walletAddress.required(),

  /* (amount) Variation of the balance compared to the previous transaction */
  amt: schemas.bigNumber.all.required(),

  /* (balance) Resulting sum of all incoming and outgoing transactions */
  bal: schemas.bigNumber.all.required(),

  /* (currency) Unit of account in which the balance keeps */
  cur: joi.string().alphanum().min(values.lengths.currency.code.min)
    .max(values.lengths.currency.code.max).required(),

  /* (limits) Minimum and maximum values that the balance property can take */
  lim: joi.object().keys({
    low: joi.alternatives().try([
      schemas.bigNumber.all,
      joi.string().valid('-Infinity')
    ]).required(),
    upp: joi.alternatives().try([
      schemas.bigNumber.all,
      joi.string().valid('Infinity')
    ]).required()
  }).required(),

  /* Hash pointer to the latest transaction the address was involved in */
  pre: joi.alternatives().when('_tx', {
    is: 1, then: joi.any().valid(null),
    otherwise: schemas.previousTransaction.required()
  })
});

module.exports = schema;
