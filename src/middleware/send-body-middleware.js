import logger from '../utils/logger';

/**
 * Send res.body if it exists.
 */
export default function middleware(req, res, next) {
  if (Object.prototype.hasOwnProperty.call(res, 'body')) {
    logger.info('Sending data from res.body');
    res.send(res.body);
  } else {
    next();
  }
}
