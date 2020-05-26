const merge = require( 'webpack-merge' );
const developmentConfig = require( './webpack.config.js' );

module.exports = merge( developmentConfig, {
  "module": {
    "rules": [
      {
        "test": /\.js$/,
        "loader": 'string-replace-loader',
        "options": {
          "search": /(\/images\/)/g,
          "replace": '/modules/custom/bos_components/modules/bos_web_app/apps/metrolist$1',
        },
      },
    ],
  },
  "mode": "production",
} );
