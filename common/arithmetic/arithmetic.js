'use strict';

const BigNumber = require('bignumber.js');

const operations = {
  add,
  subtract,
  lessThan,
  greaterThan
};

/**
 *
 */
function add(...operands) {
  return operands.reduce((result, operand) => {
    return result.plus(new BigNumber(operand));
  }, new BigNumber(0)).toFixed();
}

/**
 *
 */
function subtract(...operands) {
  return operands.reduce((result, operand) => {
    return result.minus(new BigNumber(operand));
  }, new BigNumber(0)).toFixed();
}

/**
 *
 */
function lessThan(lower, greater) {
  return (new BigNumber(lower)).lessThan(new BigNumber(greater));
}

/**
 *
 */
function greaterThan(greater, lower) {
  return (new BigNumber(greater)).greaterThan(new BigNumber(lower));
}

module.exports = operations;
