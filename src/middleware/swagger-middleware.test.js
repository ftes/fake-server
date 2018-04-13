import path from 'path';

import record from './record';
import middlewareFactory from './swagger-middleware';

jest.mock('../utils/logger');
jest.mock('./record');

const petstore = path.resolve(__dirname, 'swagger-middleware.test', 'petstore.json');
const cliOptions = {};
const middlewareOptions = {
  recordData: false,
};

describe('swagger middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      method: 'GET',
      path: '/store/inventory',
    };
    res = {};
    next = jest.fn();
  });

  it('generates random response for the inventory with the correct status code', async () => {
    const middleware = middlewareFactory(petstore, cliOptions, middlewareOptions);

    await middleware(req, res, next);

    expect(next).toBeCalled();
    expect(res.body).toEqual(expect.objectContaining({}));
    expect(res.statusCode).toEqual(200);
  });

  it('records data with correct status code', async () => {
    const middleware = middlewareFactory(petstore, cliOptions, { recordData: true });

    await middleware(req, res, next);

    expect(next).toBeCalled();
    expect(record).toBeCalledWith(req, expect.stringMatching(/^\{(.|\n)*\}$/), cliOptions, '200');
  });
});
