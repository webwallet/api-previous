'use strict';
/* eslint-disable no-console */

const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'webwallet'
});

module.exports = {
  api: logger.child({service: 'api'}),
  db:  logger.child({service: 'db'})
};
