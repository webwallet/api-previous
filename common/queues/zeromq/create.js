'use strict';

const P = require('bluebird');
const zmq = P.promisifyAll(require('zmq'), {suffix: '_'});
const uuid = require('uuid').v4;
const stringify = require('json-stable-stringify');

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
function createSocket(type, { uri, connect }) {
  if (!(type in socketTypes)) {
    return Promise.reject(new Error('invalid-socket-type'));
  }
  if (typeof uri !== 'string') {
    return Promise.reject(new Error('invalid-socket-uri'));
  }

  let socket = zmq.socket(type);

  if (connect) {
    socket.rejects = {};
    socket.resolves = {};
    socket.send_ = socketSend.bind(socket);
    socket.on('message', onMessage.bind(socket));
    socket.connect(uri);
    return socket;
  }

  return socket.bind_(uri).then(() => socket);
}

/**
 *
 */
function onMessage(msg) {
  let message;

  try {
    message = JSON.parse(msg);
  } catch (error) {
    return {error, message};
  }

  let reject = this.rejects[message._id];
  let resolve = this.resolves[message._id];
  if (typeof resolve === 'function') {
    delete message._id;
    delete this.rejects[message._id];
    delete this.resolves[message._id];

    if (message.error) {
      return reject(message);
    }
    return resolve(message);
  }

  return message; // dummy
}

/**
 *
 */
function socketSend(message) {
  let _id = uuid();
  message._id = _id;

  return new P((resolve, reject) => {
    this.rejects[_id] = reject;
    this.resolves[_id] = resolve;
    this.send(stringify(message));
  });
}

module.exports = createSocket;
