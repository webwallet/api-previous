'use strict';

const dbClient = require('*clients/db');

/* Database clients */
const uri = process.env['db:zmq:uri'];
const dbs = {
  main: dbClient.create.zeromq({uri})
};

/* Controllers */
const post = require('./post').bind({dbs});

module.exports = {
  post
};
