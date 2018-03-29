import fs from 'fs';
import path from 'path';

import record from './record';
import urlPathToFile from '../utils/url-path-to-file';

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
  const dir = urlPathToFile(req.path, path.join(cliOptions.configDir, 'data'), req.method);
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
