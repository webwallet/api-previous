'use strict';

const dbkeys = require('*common/database/keys');
const dbpaths = require('*common/database/paths');

/**
 *
 */
function * insertTransactionPointers({ db, addresses, outputs, hash }) {
  let path = dbpaths.address.transaction.pointer();
  let pointers = outputs.map(output => output.adr)
    .reduce((pointers, key, index) => {
      pointers[key] = index;
      return pointers;
    }, {});

  for (let address of addresses) {
    let key = dbkeys.address.transactions.index({address});
    let pointer = `${hash}:${pointers[address]}`;
    let pointerResult = yield db.update({key, paths: {pushFront: {[path]: pointer}}});
  }
}

module.exports = insertTransactionPointers;
