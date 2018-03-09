/* global __non_webpack_require__ */

import express from 'express';
import morgan from 'morgan';
import cliUsage from 'command-line-usage';
import cliArgs from 'command-line-args';
import path from 'path';
import process from 'process';
import * as middleware from './middleware';

const optionList = [
  {
    name: 'configDir', group: 'mandatory', description: 'Directory with `configuration.js` file and `data` folder', alias: 'c', type: String,
  },
  {
    name: 'port', description: 'Port the server listens on', alias: 'p', type: Number, defaultValue: 1337,
  },
  {
    name: 'basicAuthUser', description: 'Basic Auth User for proxying', alias: 'u', type: String,
  },
  {
    name: 'basicAuthPassword', description: 'Basic Auth Password for proxying', alias: 'w', type: String,
  },
  {
    name: 'help', description: 'Display this usage guide.', alias: 'h', type: Boolean,
  },
];
const mandatoryOptions = ['configDir'];
// eslint-disable-next-line no-underscore-dangle
const options = cliArgs(optionList, {
  partial: true,
})._all;

const allMandatoryOptionsGiven = mandatoryOptions.every(name => name in options);

if (options.help) {
  console.log(cliUsage([
    { header: 'Fake Server', content: 'Proxy, mock and play back stored responses.' },
    { header: 'Mandatory Options', optionList, group: ['mandatory'] },
    { header: 'Optional Options', optionList },
  ]));

  process.exit();
}

if (!allMandatoryOptionsGiven) {
  console.log(`Missing mandatory options: ${mandatoryOptions.filter(name => !(name in options))}`);
  console.log('Run with `--help` flag to see all options');

  process.exit(1);
}

const app = express();
app.use(morgan('tiny')); // log requests
app.use(express.json()); // parse JSON body in request

const configuration = __non_webpack_require__(path.resolve(path.join(options.configDir, 'configuration')));
configuration(app, {
  options,
  middleware,
});

app.listen(options.port, () => {
  console.log(`Fake server listening on port ${options.port}!`);
});
