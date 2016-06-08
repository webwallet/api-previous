'use strict';

const co = require('*coroutine');
const logger = require('*logger').api;

/**
 *
 */
function handleHttp(handler) {
  if (typeof handler !== 'function') {
    logger.error({name: 'missing-handler'});
    throw new Error('Missing endpoint handler');
  }

  return co(middleware.bind(handler));
}

/**
 *
 */
function * middleware(request, response) {
  let handler = this;

  /* Message composition */
  let method = request.method.toUpperCase();
  let message = {method, params: {}};

  /* Parameter parsing */
  let params = request.swagger.params;
  for (let param in params) {
    message.params[param] = params[param].value;
  }

  /* Send message and return response */
  let { status = '200', headers = {}, body = {}} = yield handler(message);

  Object.keys(headers).map(key => response.set(key, headers[key]));
  response.status(status);
  response.json(body).end();
}

module.exports = handleHttp;
