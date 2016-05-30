'use strict';

const fs = require('fs');
const path = require('path');

/**
 *
 */
function schemaName(filename) {
  return filename.replace(/-([a-z])/g, s => s[1].toUpperCase());
}

let schemas = {};

fs.readdirSync(__dirname).filter(file => {
  return path.extname(file) === '.js' && file !== 'index.js';
}).map(file => {
  let filename = path.basename(file, path.extname(file));

  return {
    name: schemaName(filename),
    schema: require(`.\/${file}`) // eslint-disable-line global-require
  };
}).forEach(file => {
  schemas[file.name] = file.schema;
});

module.exports = schemas;
