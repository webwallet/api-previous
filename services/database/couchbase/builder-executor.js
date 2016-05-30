'use strict';

/**
 * Executes a Couchbase Sub-document API builder
 */
function builderExecutor(resolve, reject) {
  this.execute((error, response) => {
    let value = {};

    for (let each of response.contents) {
      value[each.path] = each.error || each.value;
    }

    response.error = error;
    response.value = value;
    delete response.contents;

    resolve(response);
  });
}

module.exports = builderExecutor;
