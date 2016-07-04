'use strict';

module.exports = {
  post
};

/**
 *
 */
function post() {
  return {
    body: {
      data: {
        transaction: {
          hash: 'hash'
        }
      }
    }
  };
}
