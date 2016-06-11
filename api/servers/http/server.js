'use strict';

const cors = require('cors');
const http = require('http');
const https = require('https');
const yamljs = require('yamljs');
const swagger = require('swagger-tools');
const express = require('express');

const logger = require('*logger').api;
const errorCatcher = require('./errors/catcher');
const unsupportedHandler = require('./errors/unsupported');

const api = express();

const server = {
  init({ paths = {} }, callback = () => {}) {
    yamljs.load(paths.swagger, swaggerObject => {
      swagger.initializeMiddleware(swaggerObject, swaggerMiddleware => {
        api.use(cors());
        api.use(swaggerMiddleware.swaggerMetadata());
        api.use(swaggerMiddleware.swaggerRouter({
          controllers: paths.controllers
        }));
        api.use(errorCatcher);
        api.all('*', unsupportedHandler);

        callback();
      });
    });
  },
  start({ host = '0.0.0.0', port = '9000', ssl = false, options } = {}) {
    let transport = ssl ? https : http;
    let argumentz = ssl ? [options, api] : [api];
    transport.createServer.apply(transport, argumentz)
      .listen(port, host, () => {
        logger.info(`API server running on port ${port}`);
      });
  }
};

module.exports = server;
