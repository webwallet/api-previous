'use strict';

const joi = require('joi');

const values = require('./values.json');

let outputs = parseInt(values.items.outputs.max, 10);
const transactions = parseInt(values.lengths.transactions.max, 10);

if (Number.isNaN(outputs)) {
  throw new Error('values.items.outputs.max is not a number');
}
if (Number.isNaN(transactions)) {
  throw new Error('values.lengths.transactions.max is not a number');
}
outputs = outputs.toString().length;

/* Transaction pointer */
let regex = new RegExp(`^[0-9]{1,${transactions}}(\:[0-9]{1,${outputs}})?$`);
const schema = joi.string().regex(regex);

module.exports = schema;
