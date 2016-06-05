'use strict';

const httpServer = require('./servers/http');
const controllers = require('./controllers');

const paths = {
  swagger: `${__dirname}/swagger/swagger.yaml`,
  controllers: controllers.http
};

httpServer.init({ paths }, httpServer.start);
