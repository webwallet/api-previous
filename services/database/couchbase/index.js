'use strict';

const P = require('bluebird');
const co = require('*coroutine');
const zeromq = require('*queues').zeromq;

const connect = require('./connect');
const create = require('./create');
const read = require('./read');
const update = require('./update');
const delet3 = require('./delete');
const handle = require('./handle');

/* Message queue */

module.exports = {
  init: co(init)
};

/**
 * Initializes the database
 */
function * init(options) {
  /* Connect to the database */
  let bucket = yield connect(options);
  bucket = P.promisifyAll(bucket, {suffix: '_'});

  /* Expose CRUD operations */
  let db = {
    create: create.bind(bucket),
    read:   read.bind(bucket),
    update: update.bind(bucket),
    delete: delet3.bind(bucket)
  };

  /* Create ZQM queue for receiving queries */
  let uri = process.env['db:zmq:router:uri'];
  let router = yield zeromq.create('router', {uri});
  router.on('message', (...args) => handle({db, router, args}));

  return db;
}
