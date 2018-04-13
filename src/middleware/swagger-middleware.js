import swagmock from 'swagmock';

import logger from '../utils/logger';
import record from './record';

const middlewareFactory = (apiSpec, cliOptions, { recordData = true } = {}) => {
  const specMock = swagmock(apiSpec);

  return async (req, res, next) => {
    if (res.body) {
      next();
      return;
    }

    try {
      const mock = await specMock.responses({
        path: req.path,
        operation: req.method.toLowerCase(),
      });

      const [firstResponseStatus] = (mock && mock.responses && Object.keys(mock.responses)) || [];
      const firstResponse = mock.responses[firstResponseStatus];

      if (recordData) {
        record(req, JSON.stringify(firstResponse, null, 2), cliOptions, firstResponseStatus);
      }

      res.body = firstResponse;
      res.statusCode = Number.parseInt(firstResponseStatus, 10);
    } catch (e) {
      logger.error('Failed to generate mock response.', e);
    }

    next();
  };
};

export default middlewareFactory;
