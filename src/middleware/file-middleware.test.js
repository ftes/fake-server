import path from 'path';

import middlewareFactory, { getStatus } from './file-middleware';
import record from './record';

jest.mock('./record');
jest.mock('../utils/logger');

const cliOptions = {
  configDir: path.resolve(__dirname, './file-middleware.test'),
};
const middlewareOptions = {
  touchMissing: false,
};

describe('file middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      path: '/json',
      method: 'GET',
    };
    res = {};
    next = jest.fn();
  });

  it('should run without error', () => {
    const middleware = middlewareFactory(cliOptions, middlewareOptions);

    middleware(req, res, next);

    expect(next).toBeCalled();
    expect(res.body).toEqual({ someJson: true });
  });

  it('uses simple string if json cannot be parsed', () => {
    const middleware = middlewareFactory(cliOptions, middlewareOptions);
    req = {
      ...req,
      path: '/string',
    };

    middleware(req, res, next);

    expect(next).toBeCalled();
    expect(res.body).toEqual('not json');
  });

  it('should touch missing file', () => {
    req = {
      ...req,
      path: '/missing',
    };

    const middleware = middlewareFactory(cliOptions, { touchMissing: true });

    middleware(req, res, next);

    expect(next).toBeCalled();
    expect(record).toBeCalledWith(req, '', cliOptions);
  });

  it('does not overwrite existing body', () => {
    const middleware = middlewareFactory(cliOptions, middlewareOptions);
    res = {
      body: 'existing',
    };

    middleware(req, res, next);

    expect(next).toBeCalled();
    expect(res.body).toEqual('existing');
  });

  it('uses status code from file name', () => {
    const middleware = middlewareFactory(cliOptions, middlewareOptions);
    req = {
      ...req,
      method: 'POST',
      path: '/404',
    };

    middleware(req, res, next);

    expect(next).toBeCalled();
    expect(res.statusCode).toEqual(404);
  });

  describe('get status', () => {
    it('extracts status from file name', () => {
      const tests = [
        { filePath: '/a/b/get.200.json', expectedStatus: 200 },
        { filePath: '/get.404.json', expectedStatus: 404 },
        { filePath: '/a/b/get.json', expectedStatus: undefined },
      ];

      tests.forEach(({ filePath, expectedStatus }) => {
        const status = getStatus(filePath);
        expect(status).toEqual(expectedStatus);
      });
    });
  });
});
