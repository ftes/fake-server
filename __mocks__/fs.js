/* eslint-disable */
// https://facebook.github.io/jest/docs/en/manual-mocks.html

const path = require('path');

const fs = jest.genMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let filesPerDir = {};
let files = {};
function __setMockFiles(newMockFiles) {
  filesPerDir = Object.create(null);
  for (const file in newMockFiles) {
    const dir = path.dirname(file);

    if (!filesPerDir[dir]) {
      filesPerDir[dir] = [];
    }
    filesPerDir[dir].push(path.basename(file));
  }

  files = newMockFiles;
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath) {
  return filesPerDir[directoryPath] || [];
}

function existsSync(file) {
  return file in files;
}

function readFileSync(file) {
  return files[file];
}

fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;
fs.existsSync = existsSync;
fs.readFileSync = readFileSync;

module.exports = fs;
