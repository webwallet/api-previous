'use strict';

module.exports = {
  address: {
    transaction: {
      pointer: ({ index = 0 }) => {
        return `pointers[${index}]`;
      }
    }
  },
  transaction: {
    output: ({ index = 0 }) => {
      return `data.outputs[${index}]`;
    }
  }
};
