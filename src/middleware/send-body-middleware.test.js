import express from 'express';
import request from 'supertest';

import middleware from './send-body-middleware';

describe('send body middleware', () => {
  let app;
  let server;

  beforeEach(() => {
    app = express();
    server = app.listen();
  });

  afterEach(() => {
    server.close();
  });

  it('sends body', () => {
    app.use((req, res, next) => {
      res.body = 'body';
      next();
    });
    app.use(middleware);

    return request(server)
      .get('/')
      .expect((res) => {
        expect(res.text).toEqual('body');
      });
  });

  it('sends status code', () => {
    app.use((req, res, next) => {
      res.statusCode = 404;
      next();
    });
    app.use(middleware);

    return request(server)
      .get('/')
      .expect((res) => {
        expect(res.statusCode).toEqual(404);
      });
  });
});
