/* global __non_webpack_require__ */
/* eslint-disable no-console */

import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import cliUsage from 'command-line-usage';
import cliArgs from 'command-line-args';
import path from 'path';
import process from 'process';
import * as middleware from './middleware';
import logger from './utils/logger';
import optionList, { mandatoryOptions, optionsUsage } from './cli-options';

// eslint-disable-next-line no-underscore-dangle
const options = cliArgs(optionList, {
  partial: true,
})._all;

const allMandatoryOptionsGiven = mandatoryOptions.every(name => name in options);

if (options.help) {
  console.log(cliUsage(optionsUsage));

  process.exit();
}

if (!allMandatoryOptionsGiven) {
  console.log(`Missing mandatory options: ${mandatoryOptions.filter(name => !(name in options))}`);
  console.log('Run with `--help` flag to see all options');

  process.exit(1);
}

const app = express();

const preConfiguration = __non_webpack_require__(path.resolve(path.join(options.configDir, 'pre-configuration')));
if (preConfiguration) {
  preConfiguration(app, {
    options,
    middleware,
  });
}

app.use(morgan('tiny')); // log requests
app.use(bodyParser.json()); // parse JSON body in request
app.use(bodyParser.urlencoded({
  extended: true,
}));

const configuration = __non_webpack_require__(path.resolve(path.join(options.configDir, 'configuration')));
configuration(app, {
  options,
  middleware,
});

app.listen(options.port, () => {
  logger.info(`Fake server listening on port ${options.port}!`);
});
