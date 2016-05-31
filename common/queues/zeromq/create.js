'use strict';

const P = require('bluebird');
const zmq = P.promisifyAll(require('zmq'), {suffix: '_'});

const socketTypes = [
  'req', 'rep',
  'xreq', 'xrep',
  'dealer', 'router',
  'pub', 'sub',
  'push', 'pull'
].reduce((reduced, command) => (reduced[command] = true) && reduced, {});

/**
 *
 */
function createSocket(type, { uri, method = 'bind' }) {
  if (!(type in socketTypes)) {
    return Promise.reject(new Error('invalid-socket-type'));
  }
  if (typeof uri !== 'string') {
    return Promise.reject(new Error('invalid-socket-uri'));
  }

  let socket = zmq.socket(type);

  if (method === 'connect') {
    return Promise.resolve(socket.connect(uri));
  }

  return socket.bind_(uri).then(() => socket);
}

module.exports = createSocket;
