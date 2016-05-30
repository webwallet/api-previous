'use strict';

const joi = require('joi');

const walletAddress = require('./wallet-address');
const bigNumber = require('./big-number');

const schemas = {
  walletAddress,
  bigNumber
};

/* Currency Object*/
const schema = joi.object().keys({
  /* Currency code */
  code: joi.string().alphanum(),

  /* Number of existing currency units */
  supply: schemas.bigNumber.positive.required(),

  /* Magnitud of the sum of all lower limits */
  credit: schemas.bigNumber.positive.required(),

  /* Maximum number of currency units that can exist at any given time */
  ceiling: schemas.bigNumber.positive.required(),

  /* Maximum number of currency units that can exist at any given time */
  delta: schemas.bigNumber.all.required(),

  /* Indicates whether the currency ceiling can be modified */
  fixed: joi.boolean().default(false)
});

module.exports = schema;
