/**
 * NOTICE: this file is intentionally outside of `src` (override via `--configDir`)
 *
 * You can restricted to the EcmaScript version supported by node.js (https://nodejs.org/en/docs/es6/).
 *
 * Add additional responses or modify the static responses read from the `data` directory.
 * If a matching file was found, the parsed JSON is available in `res.body`.
 */

module.exports = (app, { middleware, options }) => {
  // try to serve file statically (from `./data`)
  app.use(middleware.file(options));

  // serve result (from static or swagger middleware)
  app.use(middleware.sendBody);
};
