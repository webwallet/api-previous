'use strict';

const co = require('*coroutine');
const logger = require('*logger');
const stringify = require('json-stable-stringify');

/**
 *
 */
function * handleRouterMessage({db, router, args}) {
  let message = args[args.length - 1].toString();
  router.sendError = router.sendError || sendError;

  /* Check JSON message or return an error */
  try {
    message = JSON.parse(message);
  } catch (err) {
    let error = new Error();
    error.name = 'invalid-json';
    logger.error(error);
  }

  /* Check that the message is a supported operation */
  let _id = message._id;
  let operation = message._op;
  let error = hasErrors({db, operation, params: message.params});
  if (error) {
    return router.sendError(args, {_id, error});
  }

  /* Call the database operation and return the result */
  let result = yield db[operation](message.params);
  result._id = _id;
  args[args.length - 1] = stringify(result);
  router.send(args);

  return router;
}

/**
 *
 */
function hasErrors({db, operation, params}) {
  let error = new Error();

  if (!db[operation]) {
    error.name = 'invalid-operation';
    return error;
  }
  if (typeof params !== 'object') {
    error.name = 'invalid-params-object';
    return error;
  }
  if (typeof params.key !== 'string' ||
      params.key.length === 0) {
    error.name = 'invalid-key-param';
    return error;
  }

  return false;
}

/**
 *
 */
function sendError(args, err) {
  let error = stringify(err);
  args[args.length - 1] = error;
  return this.send(args);
}

module.exports = co(handleRouterMessage);
