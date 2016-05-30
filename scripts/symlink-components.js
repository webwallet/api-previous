'use strict';

const fs = require('fs');
const components = require('../package.json').components;

try {
  fs.mkdirSync(`${__dirname}\/..\/node_modules`);
} catch (error) {
  if (error.code !== 'EEXIST') {
    throw error;
  }
}

Object.keys(components).forEach(component => {
  let target = `${__dirname}\/..\/${components[component]}`;
  let symlink = `${__dirname}\/..\/node_modules\/\*${component}`;
  try {
    fs.symlinkSync(target, symlink);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
});
