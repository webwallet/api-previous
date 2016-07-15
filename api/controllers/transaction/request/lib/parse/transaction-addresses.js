'use strict';

const config = require('*config');

/**
 *
 */
function parseTransactionAddresses({ db, transaction }) {
  /* Parse addresses from transaction inputs and ignore repeated values */
  let addresses = Object.keys(transaction.inputs.map(({data: {sub, aud}}) => {
    return [sub, ...(aud instanceof Array ? aud : [aud])];
  }).reduce((array1, array2) => array1.concat(array2))
  .reduce((reduced, key) => (reduced[key] = true) && reduced, {}));

  if (addresses.length > config.max.addressesPerTransaction) {
    let error = new Error();
    error.name = 'too-many-addresses';
    error.values = {addresses};
    throw error;
  }

  return addresses;
}

module.exports = parseTransactionAddresses;
