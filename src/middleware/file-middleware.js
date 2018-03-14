import fs from 'fs';
import path from 'path';

import record from './record';

function getSubDir(dir, subDir, remainingPathSegments) {
  const dirContents = fs.readdirSync(dir);
  const nextPath = path.join(dir, subDir);

  return dirContents.includes(subDir)
    // eslint-disable-next-line no-use-before-define
    ? getDirWithWildcards(remainingPathSegments, nextPath)
    : false;
}

/**
 * For path segment either
 * - a directory or file with exactly that name
 * - or a wildcard directory or file (`*`)
 * must be present.
 */
function getDirWithWildcards(pathSegments, dir) {
  if (pathSegments.length === 0) {
    return dir;
  }

  const remainingPathSegments = pathSegments.slice(1);
  return getSubDir(dir, pathSegments[0], remainingPathSegments)
        || getSubDir(dir, '*', remainingPathSegments)
        || false;
}

/**
 * If the requested path matches a file in data, parse that file to res.body.
 * An asterisk (*) is interpreted as a wildcard if used as directory name.
 *
 * Examples:
 * - `GET dir/file` -> `/data/dir/file/get.json`
 * - `GET dir/123`  -> `/data/dir/∗/get.json`
 * - `POST dir`     -> `/data/dir/post.json`
 */
const middleware = (cliOptions, { touchMissing } = {}) => (req, res, next) => {
  if (res.body) {
    next();
    return;
  }

  console.log('looking for', req.method, req.path);
  const pathSegments = req.path.split('/').filter(s => s !== '');
  const dir = getDirWithWildcards(pathSegments, path.join(cliOptions.configDir, 'data'));
  const file = dir && `${path.join(dir, req.method.toLowerCase())}.json`;


  if (dir && fs.existsSync(file)) {
    console.log('found', file);
    res.body = '';
    try {
      res.body = JSON.parse(fs.readFileSync(file));
    } catch (e) {
      // ignore, maybe the file is empty
    }
  } else if (touchMissing) {
    record(req, '', cliOptions);
    res.body = '';
  }

  next();
};

export default middleware;
