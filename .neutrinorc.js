const webpack = require('webpack');

module.exports = {
  use: [
    ['@neutrinojs/airbnb-base', {
      eslint: {
          rules: {
              'import/no-named-as-default-member': 'off',
          },
      },
    }],
    '@neutrinojs/node',
    '@neutrinojs/jest',

    neutrino => neutrino.config.plugin('banner')
      .use(webpack.BannerPlugin, [{ banner: '#!/usr/bin/env node', raw: true }]),
  ],

  options: {
    tests: 'src'
  }
};
  