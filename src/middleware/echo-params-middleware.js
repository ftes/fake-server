import logger from '../utils/logger';

function parseNumbers(obj) {
  const result = {};
  // convert to numbers
  Object.getOwnPropertyNames(obj).forEach((key) => {
    const value = obj[key];
    const parsedValue = value * 1;
    result[key] = Number.isNaN(parsedValue)
      ? value
      : parsedValue;
  });
  return result;
}

export default function middleware(req, res, next) {
  res.body = res.body || {};
  if (typeof res.body !== 'object') {
    logger.warn('Could not echo params into non-object body');
    next();
    return;
  }

  // eslint-disable-next-line no-underscore-dangle
  res.body._params = parseNumbers(req.query);
  next();
}
