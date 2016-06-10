'use strict';

const httpWrapper = require('./httpWrapper');
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
  let controller = require(`./${filepath}`).bind(queues[rootEndpoint]);
  return controller;
}

module.exports = {
  http: setupControllers(httpWrapper, controllers)
};
