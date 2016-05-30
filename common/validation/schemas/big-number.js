'use strict';

const joi = require('joi');

const values = require('./values.json');
const parts = values.lengths.bigNumber;

let integral = parseInt(parts.integral.max, 10);
let fractional = parseInt(parts.fractional.max, 10);

if (Number.isNaN(integral)) {
  throw new Error('values.lengths.bigNumber.integral.max is not a number');
}
if (Number.isNaN(fractional)) {
  throw new Error('values.lengths.bigNumber.fractional.max is not a number');
}

/* Big Number */
// [-+]? sign (optional)
// [0-9]{1,100} up to 100 digits
// (\.[0-9]{1,10})? up to 10 decimal places (optional)
// ([eE][-+]?[0-9]+)? scientific notation (optional)
/* eslint-disable max-len */
const positiveRegex = new RegExp(`^[+]?[0-9]{1,${integral}}(\.[0-9]{1,${fractional}})?$`);
const negativeRegex = new RegExp(`^[-][0-9]{1,${integral}}(\.[0-9]{1,${fractional}})?$`);
const bigNumberRegex = new RegExp(`^[-+]?[0-9]{1,${integral}}(\.[0-9]{1,${fractional}})?$`);
/* eslint-enable max-len */

/* Big Number extension */
// const joix = joi.extend({});

/* Big Number */
module.exports = {
  positive: joi.string().regex(positiveRegex),
  negative: joi.string().regex(negativeRegex),
  all: joi.string().regex(bigNumberRegex)
};
