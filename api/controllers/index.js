'use strict';

const handleHttp = require('./handleHttp');

/* Handlers */
const transaction = require('./transaction');

/* Controllers */
const controllers = {
  http: {
    'transaction.post': handleHttp(transaction.post)
  }
};

module.exports = controllers;
