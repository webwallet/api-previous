'use strict';

const dbkeys = require('*common/database/keys');
const dbpaths = require('*common/database/paths');

/**
 *
 */
function * insertTransactionPointers({ db, addresses, outputs, hash }) {
  let path = dbpaths.address.transaction.latest();
  let indexes = outputs.map(output => output.adr)
    .reduce((indexes, key, index) => {
      indexes[key] = index;
      return indexes;
    }, {});

  for (let address of addresses) {
    let key = dbkeys.address.transactions.latest({address});
    let pointer = {hash, index: indexes[address]};
    let pointerResult = yield db.update({key, paths: {
      replace: {[path]: pointer}
    }});
  }
}

module.exports = insertTransactionPointers;
