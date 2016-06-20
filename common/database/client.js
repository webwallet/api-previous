'use strict';

const zeromq = require('*queues').zeromq;

module.exports = {
  create: {
    zeromq: createZeromqDatabaseClient
  }
};

/**
 *
 */
function createZeromqDatabaseClient({ uri }) {
  const socket = zeromq.create('xreq', {uri, connect: true});

  const db = {
    send(_op, params = {}) {
      return socket.send_({_op, params});
    }
  };

  db.create = db.send.bind(db, 'create');
  db.read = db.send.bind(db, 'read');
  db.update = db.send.bind(db, 'update');

  return db;
}
