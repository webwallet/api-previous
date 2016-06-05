'use strict';

const logger = require('*logger').api;

/**
 *
 */
function wrapHttp(method, endpoint, handler) {
  if (typeof handler !== 'function') {
    logger.error({name: 'missing-handler', details: endpoint});
    throw new Error(`Missing endpoint handler: ${method} ${endpoint}`);
  }

  return function middleware(request, response) {
    /* Message composition */
    let message = {method, endpoint, params: {}};

    /* Parameter parsing */
    let params = request.swagger.params;
    for (let param in params) {
      message.params[param] = params[param].value;
    }

    return handler(message)
      .then(({ status = '200', headers = {}, body = {}}) => {
        Object.keys(headers).map(key => response.set(key, headers[key]));
        response.status(status);
        response.json(body).end();
      });
  };
}

module.exports = wrapHttp;
