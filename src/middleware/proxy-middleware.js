import proxy from 'express-http-proxy';
import record from './record';

const base64 = str => Buffer.from(str).toString('base64');

const proxyAndRecord = (host, cliOptions, { recordData = true } = {}) => proxy(host, {
  proxyReqPathResolver: req => req.originalUrl,
  userResDecorator: (proxyRes, proxyResData, userReq) => {
    if (recordData) {
      record(userReq, proxyResData, cliOptions);
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

export default proxyAndRecord;
