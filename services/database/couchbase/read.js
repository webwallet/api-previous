'use strict';

const COMMANDS = ['get', 'exists']
  .reduce((reduced, command) => (reduced[command] = true) && reduced, {});

const builderExecutor = require('./builder-executor');

/**
 *
 */
function read({ key, paths = {}, options = {} } = {}) {
  let db = this;
  // if (key instanceof Array) {
  //   return readKeys({ db, keys: key });
  // }
  if (Object.keys(paths).length > 0) {
    return readKeyPaths({db, key, paths, options});
  }
  return readKey({db, key, options});
}

/**
 *
 */
function readKeyPaths({ db, key, paths, options }) {
  let builder = db.lookupIn(key, options);

  for (let command in paths) {
    if (command in COMMANDS) {
      for (let path of paths[command]) {
        builder = builder[command](path);
      }
    }
  }

  return new Promise(builderExecutor.bind(builder));
}

/**
 *
 */
function readKey({ db, key, options }) {
  return db.get_(key, options)
    .catch(error => Promise.resolve({key, error}));
}

/**
 *
 */
// function readKeys({ db, keys }) {
//   return db.getMulti_(keys)
//     .catch(error => Promise.resolve({keys, error}));
// }

module.exports = read;
