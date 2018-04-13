import middleware from './echo-params-middleware';

describe('echo params middleware', () => {
  let next;

  beforeEach(() => {
    next = jest.fn();
  });

  function callMiddleware(query, res = { body: {} }) {
    const req = {
      query,
    };
    middleware(req, res, next);
    return res;
  }

  it('adds param to res.body', () => {
    const res = callMiddleware({ text: 'abc' });

    expect(next).toBeCalled();
    expect(res.body).toEqual({ _params: { text: 'abc' } });
  });

  it('parses numbers', () => {
    const res = callMiddleware({ number: '123' });

    expect(next).toBeCalled();
    expect(res.body).toEqual({ _params: { number: 123 } });
  });

  it('adds body if it does not exist', () => {
    const res = callMiddleware({ number: '123' }, {});

    expect(next).toBeCalled();
    expect(res.body).toEqual({ _params: { number: 123 } });
  });

  it('does nothing if body is not an object', () => {
    const res = callMiddleware({ number: '123' }, { body: 'string' });

    expect(next).toBeCalled();
    expect(res.body).toEqual('string');
  });
});
