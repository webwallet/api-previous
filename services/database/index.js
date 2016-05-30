'use strict';

const couchbase = require('./couchbase');

const dbs = {
  couchbase
};

module.exports = dbs[process.env['db:type'] || 'couchbase'].init();
