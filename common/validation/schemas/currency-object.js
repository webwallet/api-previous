'use strict';

const joi = require('joi');

const values = require('./values.json');
const walletAddress = require('./wallet-address');
const bigNumber = require('./big-number');

const schemas = {
  walletAddress,
  bigNumber
};

/* Currency Object*/
const schema = joi.object().keys({
  /* Currency code */
  code: joi.string().alphanum().min(values.lengths.currency.code.min)
    .max(values.lengths.currency.code.max).required(),

  /* Number of existing currency units */
  supply: schemas.bigNumber.positive.required(),

  /* Magnitud of the sum of all lower limits */
  credit: schemas.bigNumber.positive.required(),

  /* Relative increase or decrease in the currency supply */
  easing: schemas.bigNumber.all.required(),

  /* Maximum number of currency units that can exist at any given time */
  ceiling: schemas.bigNumber.positive.required(),

  /* Indicates whether the currency ceiling can be modified */
  fixed: joi.boolean().required()
});

module.exports = schema;
