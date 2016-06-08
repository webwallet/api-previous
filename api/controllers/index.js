'use strict';

const handleHttp = require('./handleHttp');
const transaction = require('./transaction');

/* Controllers */
const controllers = [
  'transaction.post'
];

const rootEnpoints = {
  transaction
};

/**
 *
 */
function setupControllers(wrapper, paths) {
  return paths.reduce((reduced, key) => {
    return (reduced[key] = wrapper(findController(key))) && reduced;
  }, {});
}

/**
 *
 */
function findController(path) {
  let [root, ...segments] = path.split('.');
  let controller = segments
    .reduce((reduced, segment) => reduced[segment], rootEnpoints[root]);

  return controller;
}

module.exports = {
  http: setupControllers(handleHttp, controllers)
};
