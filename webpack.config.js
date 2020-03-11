require( 'dotenv' ).config();
const Dotenv = require( 'dotenv-webpack' );
const webpack = require( 'webpack' );
const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const fs = require( 'fs' );

module.exports = {
  "entry": "./src/index.js",
  "output": {
    "path": path.resolve( __dirname, "dist" ),
    "filename": "index.bundle.js",
  },
  "resolve": {
    "alias": {
      "@patterns": path.resolve( __dirname, 'patterns' ),
    },
  },
  "module": {
    // "loaders": [
    //   { "test": /\.styl$/, "loader": "style-loader!css-loader!stylus-loader" },
    // ],
    "rules": [
      {
        "test": /\.js$/,
        "use": "babel-loader",
      },
      {
        "test": /\.css$/,
        "use": ["style-loader", "css-loader"],
      },
      {
        "test": /\.s[ac]ss$/i,
        "use": ["style-loader", "css-loader", "sass-loader"],
      },
      {
        "test": /\.svg$/,
        "use": "file-loader",
      },
    ],
  },
  "mode": "development",
  "optimization": {
    "nodeEnv": false,
  },
  "plugins": [
    new HtmlWebpackPlugin( {
      "template": "public/index.html",
      "PUBLIC_URL": process.env.PUBLIC_URL,
      "NODE_ENV": process.env.NODE_ENV,
    } ),
    new Dotenv(),
  ],
};
