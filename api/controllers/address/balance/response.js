'use strict';

module.exports = {
  get
};

/**
 *
 */
function get({ balance, limits }) {
  return {
    body: {
      data: {
        balance,
        limits
      }
    }
  };
}
