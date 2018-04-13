/* eslint-disable no-underscore-dangle */
import fs from 'fs';

import middlewareFactory from './file-middleware';
import record from './record';

jest.mock('fs');
jest.mock('./record');

const cliOptions = {
  configDir: '/config',
};
const middlewareOptions = {
  touchMissing: false,
};

describe('file middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    fs.__setMockFiles({
      '/config/data/path/get.json': '{ "someJson": true }',
    });
    req = {
      path: '/path',
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
    fs.__setMockFiles({
      '/config/data/path/get.json': 'not json',
    });
    const middleware = middlewareFactory(cliOptions, middlewareOptions);

    middleware(req, res, next);

    expect(next).toBeCalled();
    expect(res.body).toEqual('not json');
  });

  it('should touch missing file', () => {
    fs.__setMockFiles({});
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
});
