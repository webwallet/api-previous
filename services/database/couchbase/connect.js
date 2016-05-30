'use strict';

const couchbase = require('couchbase');
const logger = require('*logger').db;

/* Environment variables */
const env = {
  host: process.env['db:host'] || 'localhost',
  port: process.env['db:port'],
  name: process.env['db:name'] || 'default',
  password: process.env['db:password']
};

/**
 * Connects to a Couchbase database.
 * @param {object} options={} - Describes the target database server and the credentials needed.
   * @param {string} [options.host=env.host|"localhost"] - The hostname of the database.
   * @param {number} [otions.port=env.port|8091]         - The port in which the database accepts connections.
   * @param {string} [options.name=env.name|"default"]   - The name of the bucket.
   * @param {string} [options.password=""]      - The password required to get access to the database.
 * @returns {Promise} bucket -
*/ // eslint-disable-next-line max-len
function connect({ host = env.host, port = env.port, name = env.name, password = env.password } = {}) {
  let hostPort = host + (port ? `:${port}` : '');
  let connectionString = `couchbase:\/\/${hostPort}`;

  let cluster = new couchbase.Cluster(connectionString);

  return new Promise((resolve, reject) => {
    let bucket = cluster.openBucket(name, password, (error) => {
      if (error) {
        logger.error(error);
        return reject(error);
      }

      logger.info(`Couchbase client connected to ${hostPort}`);
      return resolve(bucket);
    });
  });
}

module.exports = connect;
