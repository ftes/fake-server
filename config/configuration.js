/**
 * NOTICE: Copy this `config` directory to your application.
 *
 * This file is not transpiled, you can use restricted to the EcmaScript version supported by node.js (https://nodejs.org/en/docs/es6/).
 *
 * Add additional responses or modify the static responses read from the `data` directory.
 * If a matching file was found, the parsed JSON is available in `res.body`.
 *
 * You can use the following middleware (passed to the function):
 * - `echoParams`
 * - `file`
 * - `sendBody`
 * - `swagger`
 */

const echo = (req, res) => {
  res.send(JSON.stringify({
    ...req.body,
    ...req.query,
  }));
};

module.exports = (app, { middleware, options }) => {
  // try to serve file statically (from `./data`)
  app.use(middleware.file(options));

  // serve result (from static or swagger middleware)
  app.use(middleware.sendBody);

  // do other processing (only if not other middleware applies)
  app.all(['/echo', '/echo/*'], echo);
};
