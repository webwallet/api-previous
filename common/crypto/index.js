'use strict';

const crypto = require('crypto');
// const elliptic = require('elliptic');

module.exports = {
  createHash
};

/**
 *
 */
function createHash({ algorithm = 'sha256', data }) {
  let hash;

  switch (algorithm) {
  case 'sha256':
  case 'sha512':
    hash = crypto.createHash(algorithm).update(data).digest('hex');
    break;
  default:
    hash = crypto.createHash('sha256').update(data).digest('hex');
    break;
  }

  return hash;
}
