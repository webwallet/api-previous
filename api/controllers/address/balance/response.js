'use strict';

module.exports = {
  get
};

/**
 *
 */
function get({ output, count }) {
  return {
    body: {
      data: {
        balance: output.bal,
        currency: output.cur,
        limits: {
          lower: output.lim.low,
          upper: output.lim.upp
        }
      },
      meta: {
        count
      }
    }
  };
}
