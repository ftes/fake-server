import proxy from 'express-http-proxy';
import record from './record';

const base64 = str => Buffer.from(str).toString('base64');

const proxyAndRecord = (
  host, cliOptions,
  { recordData = true, proxyReqPathResolver } = {},
) => {
  const proxyMiddleware = proxy(host, {
    proxyReqPathResolver: proxyReqPathResolver || (req => req.originalUrl),
    userResDecorator: (proxyRes, proxyResData, userReq) => {
      if (recordData) {
        record(userReq, proxyResData, cliOptions, proxyRes.statusCode);
      }

      return proxyResData;
    },
    proxyReqOptDecorator: (proxyReqOpts) => {
      if (cliOptions.basicAuthUser && cliOptions.basicAuthPassword) {
        const basicAuthToken = base64(`${cliOptions.basicAuthUser}:${cliOptions.basicAuthPassword}`);
        // eslint-disable-next-line no-param-reassign
        proxyReqOpts.headers.Authorization = `Basic ${basicAuthToken}`;
      }
      return proxyReqOpts;
    },
  });

  return (req, res, next, ...args) => {
    if (res.body) {
      next();
      return;
    }

    proxyMiddleware(req, res, next, ...args);
  };
};

export default proxyAndRecord;
