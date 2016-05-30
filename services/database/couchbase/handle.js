'use strict';

const co = require('*coroutine');
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
    return router.sendError(args, {name: 'invalid-json'});
  }

  /* Check that the message is a supported operation */
  let operation = message.name;
  if (!db[operation]) {
    return router.sendError(args, {name: 'invalid-operation'});
  }
  if (typeof message.params !== 'object') {
    return router.sendError(args, {name: 'invalid-params-object'});
  }
  if (typeof message.params.key !== 'string' ||
      message.params.key.length === 0) {
    return router.sendError(args, {name: 'invalid-key-param'});
  }

  /* Call the database operation and return the result */
  let result = yield db[operation](message.params);
  args[args.length - 1] = stringify(result);
  router.send(args);

  return router;
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
