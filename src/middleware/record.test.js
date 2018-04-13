import fs from 'fs';

import record from './record';

jest.mock('fs-extra');
jest.mock('fs');
jest.mock('../utils/logger');

const options = {
  configDir: '/config',
};

describe('record', () => {
  it('writes data to file', () => {
    const data = 'data';
    const req = {
      method: 'GET',
      baseUrl: '/',
      path: '/path',
    };

    record(req, data, options);

    expect(fs.writeFileSync).toBeCalledWith('/config/data/path/get.200.json', data);
  });

  it('writes custom status code', () => {
    const data = 'data';
    const req = {
      method: 'POST',
      baseUrl: '/v2',
      path: '/path',
    };

    record(req, data, options, 404);

    expect(fs.writeFileSync).toBeCalledWith('/config/data/v2/path/post.404.json', data);
  });
});
