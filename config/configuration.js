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
 * - `proxy`
 * - `sendBody`
 * - `swagger`
 */

const echo = (req, res) => {
  res.send(JSON.stringify({
    ...req.body,
    ...req.query,
  }));
};

/**
 * @typedef {(req, res, next) => {}} Middleware
 * @typedef {{ touchMissing: boolean }} FileOptions
 * @typedef {{ recordData: boolean }} ProxyOptions
 * @typedef {{ recordData: boolean }} SwaggerOptions
 * @typedef {{ configDir: string, port: number, basicAuthUser: string, basicAuthPassword: string, help: boolean }} CliOptions
 *
 * @param {Object} app
 * @param {Object} allOptions
 * @param {Object} allOptions.middleware
 * @param {Middleware} allOptions.middleware.echoParams
 * @param {(options: CliOptions, fileOptions: FileOptions) => Middleware} allOptions.middleware.file
 * @param {(host: string, options: CliOptions, proxyOptions: ProxyOptions) => Middleware} allOptions.middleware.proxy
 * @param {Middleware} allOptions.middleware.sendBody
 * @param {(apiSpec: string, options: CliOptions, proxyOptions: SwaggerOptions) => Middleware} allOptions.middleware.swagger
 * @param {CliOptions} allOptions.options
 */
module.exports = (app, allOptions) => {
  const { middleware, options } = allOptions;

  // try to serve file statically (from `./data`)
  app.use(middleware.file(options, { touchMissing: true }));

  // serve result (from static or swagger middleware)
  app.use(middleware.sendBody);

  // do other processing (only if not other middleware applies)
  app.all(['/echo', '/echo/*'], echo);
};
