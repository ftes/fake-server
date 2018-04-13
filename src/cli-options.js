const optionsList = [
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

export const mandatoryOptions = ['configDir'];

export const optionsUsage = [
  { header: 'Fake Server', content: 'Proxy, mock and play back stored responses.' },
  { header: 'Mandatory Options', optionsList, group: ['mandatory'] },
  { header: 'Optional Options', optionsList },
];

export default optionsList;
