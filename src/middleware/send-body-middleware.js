/**
 * Send res.body if it exists.
 */
export default function middleware(req, res, next) {
  if (Object.prototype.hasOwnProperty.call(res, 'body')) {
    console.log('Sending data from res.body');

    if (res.body) res.send(res.body);
    else res.sendStatus(200);
  } else {
    next();
  }
}
