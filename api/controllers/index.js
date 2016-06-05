'use strict';

const logger = require('*logger').api;
const handleHttp = require('./wrapHttp');

/* Handlers */
const transaction = require('./transaction');

/* Controllers */
const controllers = {
  http: {
    'transaction.post': handleHttp(
      'POST', '/transaction', transaction.post
    )
  }
};

module.exports = controllers;
