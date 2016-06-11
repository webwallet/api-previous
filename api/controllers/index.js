'use strict';

const tryCatch = require('*common/trycatch');
const httpWrapper = require('./http-wrapper');
const databaseClient = require('*clients/db');

/* Controllers */
const controllers = [
  'address.balance.get',
  'currency.supply.get',
  'transaction.request.post'
];

/* Database queues */
const queues = {};
const databaseUris = {
  main: process.env['db:zmq:xreq:uri']
};

/**
 *
 */
function setupControllers(wrapper, paths) {
  return paths.reduce((reduced, key) => {
    return (reduced[key] = wrapper(loadController(key))) && reduced;
  }, {});
}

/**
 *
 */
function loadController(path) {
  let [rootEndpoint] = path.split('.'); // first segment = root endpoint
  let filepath = path.replace(/\./g, '/'); // replace dots with slashes

  if (!queues[rootEndpoint]) {
    queues[rootEndpoint] = {
      dbs: {main: databaseClient.create.zeromq({uri: databaseUris.main})}
    };
  }

  // eslint-disable-next-line global-require
  let endpoint = require(`./${filepath}`);
  let controller = endpoint.controller;
  let exceptionHandler = endpoint.exceptionHandler;
  let context = queues[rootEndpoint];

  return tryCatch.call(context, controller, exceptionHandler);
}

module.exports = {
  http: setupControllers(httpWrapper, controllers)
};
