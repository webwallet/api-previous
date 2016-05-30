'use strict';

const COMMANDS = ['upsert', 'replace', 'counter', 'pushFront'] // 'pushBack', 'arrayInsert' not allowed
  .reduce((reduced, command) => (reduced[command] = true) && reduced, {});

const builderExecutor = require('./builder-executor');

/**
 *
 */
function update({ key, value, paths = [], upsert = false, options = {} } = {}) {
  let db = this;
  if (Object.keys(paths).length > 0) {
    return updateKeyPaths({db, key, paths, options});
  }
  return updateKey({db, key, value, upsert, options});
}

/**
 *
 */
function updateKeyPaths({ db, key, paths, options }) {
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
function updateKey({ db, key, value, upsert, options }) {
  if (upsert) {
    return db.upsert_(key, value, options)
      .catch(error => Promise.resolve({key, error}));
  }
  return db.replace_(key, value, options)
    .catch(error => Promise.resolve({key, error}));
}

module.exports = update;
