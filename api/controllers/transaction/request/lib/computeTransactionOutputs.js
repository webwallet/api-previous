'use strict';

const arithmetic = require('*common/arithmetic');

/**
 *
 */
function computeTransactionOutputs({ db, addresses, currencies, inputs, previous }) {
  /* Initialize total transaction amount counters by address */
  let amounts = addresses.reduce((amounts, address) => (amounts[address] = 0) || amounts, {});
  let outputs = [];

  /* Group transaction inputs and previous outputs by currency */
  let inputsByCurrency = {};
  let outputsByCurrency = {};
  for (let currency of currencies) {
    inputsByCurrency[currency] = [];
    outputsByCurrency[currency] = [];
  }
  for (let input of inputs) inputsByCurrency[input.data.cur].push(input);
  for (let output of previous.outputs) outputsByCurrency[output.cur].push(output);

  /* Compute transaction outputs by currency */
  for (let currency of currencies) {
    /* Calculate total transaction amounts by address */
    for (let input of inputsByCurrency[currency]) {
      amounts[input.data.sub] = arithmetic.subtract(amounts[input.data.sub], input.data.amt);
      amounts[input.data.aud] = arithmetic.add(amounts[input.data.aud], input.data.amt);
    }
    /* Compute transaction outputs from transaction amounts and previous outputs */
    outputs.push(...computeCurrencyOutputs({amounts, previous: outputsByCurrency[currency]}));
  }

  return outputs;
}

/**
 *
 */
function computeCurrencyOutputs({ amounts, previous }) {
  let outputs = [];
  let error = new Error();

  /* Build new outputs from previous outputs */
  for (let output of previous) {
    output = Object.assign({}, output);

    output._tx += 1;
    output.amt = amounts[output.adr];
    output.bal = arithmetic.add(output.amt, output.bal);

    /* Fail if the address balance is less than its lower limit */
    if (arithmetic.lessThan(output.bal, output.lim.low)) {
      error.name = 'lower-limit-reached';
      error.values = {address: output.adr};
      throw error;
    }
    /* Fail if the address balance is greater than its upper limit */
    if (arithmetic.greaterThan(output.bal, output.lim.upp)) {
      error.name = 'upper-limit-reached';
      error.values = {address: output.adr};
      throw error;
    }

    outputs.push(output);
  }

  return outputs;
}

module.exports = computeTransactionOutputs;
