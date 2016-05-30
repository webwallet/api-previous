'use strict';

const COMMANDS = ['insert', 'addUnique']
  .reduce((reduced, command) => (reduced[command] = true) && reduced, {});

const builderExecutor = require('./builder-executor');

module.exports = create;

/**
 *
 */
function create({ key, value, paths = {}, options = {} } = {}) {
  let db = this;
  if (Object.keys(paths).length > 0) {
    return createKeyPaths({db, key, paths, options});
  }
  return createKey({db, key, value, options});
}

/**
 *
 */
function createKeyPaths({ db, key, paths, options }) {
  let builder = db.mutateIn(key, options);

  for (let command in paths) {
    if (command in COMMANDS) {
      for (let path in paths[command]) {
        builder = builder[command](path, paths[command][path],
          /* createParents */ true);
      }
    }
  }

  return new Promise(builderExecutor.bind(builder));
}

/**
 *
 */
function createKey({ db, key, value, options }) {
  return db.insert_(key, value, options)
    .catch(error => Promise.resolve({key, error}));
}
