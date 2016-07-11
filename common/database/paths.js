'use strict';

module.exports = {
  address: {
    transaction: {
      pointer: (index) => {
        return typeof index === 'number' ? `pointers[${index}]` : 'pointers';
      }
    }
  },
  transaction: {
    output: ({ index = 0 }) => {
      return `data.outputs[${index}]`;
    }
  }
};
