import express from 'express';
import request from 'supertest';

import record from './record';
import middlewareFactory from './proxy-middleware';

jest.mock('./record');

const cliOptions = {};
const middlewareOptions = {
  recordData: false,
};

expect.extend({
  toMatchString(received, argument) {
    const receivedString = received.toString();
    const pass = receivedString === argument;
    return {
      pass,
      message: () => `expected ${receivedString} to equal ${argument}`,
    };
  },
});

describe('proxy middleware', () => {
  let proxyUrl;
  let proxyApp;
  let proxyServer;
  let app;
  let server;

  beforeEach(() => {
    proxyApp = express();
    proxyServer = proxyApp.listen();
    app = express();
    server = app.listen();
    proxyUrl = `http://localhost:${proxyServer.address().port}`;
  });

  afterEach(() => {
    proxyServer.close();
    server.close();
  });

  it('proxies request', () => {
    proxyApp.use((req, res) => {
      res.send('proxy response');
    });
    const middleware = middlewareFactory(proxyUrl, cliOptions, middlewareOptions);
    app.use(middleware);

    return request(server)
      .get('/')
      .expect((res) => {
        expect(res.text).toEqual('proxy response');
      });
  });

  it('records response', () => {
    proxyApp.use((req, res) => {
      res.send('proxy response');
    });
    const middleware = middlewareFactory(proxyUrl, cliOptions, { recordData: true });
    app.use(middleware);

    return request(server)
      .get('/path')
      .expect((res) => {
        expect(res.text).toEqual('proxy response');
        expect(record).toBeCalledWith(expect.objectContaining({
          baseUrl: '',
          path: '/path',
          method: 'GET',
        }), expect.anything(), cliOptions);
        expect(record.mock.calls[0][1]).toMatchString('proxy response');
      });
  });
});
