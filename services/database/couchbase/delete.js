'use strict';

const builderExecutor = require('./builder-executor');

/**
 *
 */
function delet3({ key, paths = [], options = {} } = {}) {
  let db = this;
  if (paths.length > 0) {
    return removeKeyPaths({db, key, paths, options});
  }
  return removeKey({db, key, options});
}

/**
 *
 */
function removeKeyPaths({ db, key, paths, options }) {
  let builder = db.mutateIn(key, options);

  for (let path of paths) {
    builder = builder.remove(path);
  }

  return new Promise(builderExecutor.bind(builder));
}

/**
 *
 */
function removeKey({ db, key, options }) {
  return db.remove_(key, options)
    .catch(error => Promise.resolve({key, error}));
}

module.exports = delet3;
