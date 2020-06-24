const merge = require( 'webpack-merge' );
const developmentConfig = require( './webpack.config.js' );

module.exports = merge( developmentConfig, {
  "output": {
    "publicPath": "/modules/custom/bos_components/modules/bos_web_app/apps/metrolist/",
  },
  "module": {
    "rules": [
      {
        "test": /\.js$/,
        "loader": 'string-replace-loader',
        "options": {
          "multiple": [
            {
              "search": /\/images\/(.*)/g,
              "replace": 'https://assets.boston.gov/icons/metrolist/$1',
            },
            {
              "search": /\/metrolist\/(.*)/g,
              "replace": 'https://www.boston.gov/metrolist/$1',
            },
          ],
        },
      },
    ],
  },
  "mode": "production",
} );
