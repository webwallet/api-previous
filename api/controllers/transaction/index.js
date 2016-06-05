'use strict';

module.exports = {
  post: postTransactionRequest
};

/**
 *
 */
function postTransactionRequest(message) {
  return Promise.resolve({
    body: {
      data: {
        status: 'pending'
      }
    }
  });
}
