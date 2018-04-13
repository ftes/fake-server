import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';

import logger from '../utils/logger';

export default function record(req, data, options, statusCode = 200) {
  const method = req.method.toLowerCase();
  const dir = path.join(options.configDir, 'data', req.baseUrl, req.path);
  const file = path.join(dir, `${method}.${statusCode}.json`);
  logger.info('record response to', file);
  fsExtra.mkdirsSync(dir);
  fs.writeFileSync(file, data);
}
