'use strict';

const crypto = require('*common/crypto');
const stringify = require('json-stable-stringify');

/**
 *
 */
function buildTransactionRecord({ transaction }) {
  transaction.nonce = Math.random();
  let record = {hash: {}, data: transaction, sigs: []};

  record.hash.val = crypto.createHash({data: stringify(record.data)});

  return record;
}

module.exports = buildTransactionRecord;
