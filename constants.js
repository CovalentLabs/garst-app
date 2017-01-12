"use strict";
const root = require('./helpers.js').root
const ip = require('ip');

exports.HOST = ip.address();
exports.DEV_PORT = 3000;
exports.E2E_PORT = 4201;
exports.PROD_PORT = 8088;

/**
 * These constants set whether or not you will use proxy for Webpack DevServer
 * For advanced configuration details, go to:
 * https://webpack.github.io/docs/webpack-dev-server.html#proxy
 */
exports.USE_DEV_SERVER_PROXY = false;
exports.DEV_SERVER_PROXY_CONFIG = {
  '**': 'http://localhost:8089'
}

/**
 * These constants set the source maps that will be used on build.
 * For info on source map options, go to:
 * https://webpack.github.io/docs/configuration.html#devtool
 */
exports.DEV_SOURCE_MAPS = 'eval';
exports.PROD_SOURCE_MAPS = 'source-map';

/**
 * Set watch options for Dev Server. For better HMR performance, you can
 * try setting poll to 1000 or as low as 300 and set aggregateTimeout to as low as 0.
 * These settings will effect CPU usage, so optimal setting will depend on your dev environment.
 * https://github.com/webpack/docs/wiki/webpack-dev-middleware#watchoptionsaggregatetimeout
 */
exports.DEV_SERVER_WATCH_OPTIONS = {
  poll: undefined,
  aggregateTimeout: 300,
  ignored: /node_modules/
}

exports.EXCLUDE_SOURCE_MAPS = [
  // these packages have problems with their sourcemaps
  root('node_modules/@angular'),
  root('node_modules/rxjs'),
  root('node_modules/typescript-collections'),
]

exports.MY_COPY_FOLDERS = [
  // use this for folders you want to be copied in to Client dist
  // src/assets and index.html are already copied by default.
  // format is { from: 'folder_name', to: 'folder_name' }
]

exports.MY_POLYFILL_DLLS = [
  // list polyfills that you want to be included in your dlls files
  // this will speed up initial dev server build and incremental builds.
  // Be sure to run `npm run build:dll` if you make changes to this array.
]

exports.MY_VENDOR_DLLS = [
  // list vendors that you want to be included in your dlls files
  // this will speed up initial dev server build and incremental builds.
  // Be sure to run `npm run build:dll` if you make changes to this array.
]

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
exports.MY_CLIENT_PLUGINS = [
  // use this to import your own webpack config Client plugins.
  // Extract css files
  // Reference: https://github.com/webpack/extract-text-webpack-plugin
  // Disabled when in test mode or not in build mode
  new ExtractTextPlugin({filename: 'css/[name].[hash].css'}),

  // Tslint configuration for webpack 2
  new webpack.LoaderOptionsPlugin({
    options: {
      /**
       * Sass
       * Reference: https://github.com/jtangelder/sass-loader
       * Transforms .scss files to .css
       */
      sassLoader: {
        includePaths: [
          // path.resolve(__dirname, "node_modules/bootstrap/scss"),
          root("src/@styles"),
        ],
      },

      // We added this when we needed to enable sourceMaps for SASS
      // https://github.com/jtangelder/sass-loader/issues/285#issuecomment-248382611
      // https://github.com/bholloway/resolve-url-loader/issues/33#issuecomment-249830601
      context: root('src'),

      /**
       * PostCSS
       * Reference: https://github.com/postcss/autoprefixer-core
       * Add vendor prefixes to your css
       */
      postcss: [
        autoprefixer({
          browsers: ['last 2 version']
        })
      ],
    }
  })
]

exports.MY_CLIENT_PRODUCTION_PLUGINS = [
  // use this to import your own webpack config plugins for production use.
]

exports.MY_CLIENT_RULES = [
  // use this to import your own rules for Client webpack config.
  // support for .scss files
  // use 'null' loader in test mode (https://github.com/webpack/null-loader)
  // all css in src/style will be bundled in an external css file
  {
    test: /\.(scss|sass)$/,
    include: [ root('src/@styles') ],
    loader: ExtractTextPlugin.extract({
      fallbackLoader: 'style-loader',
      loader: ['css-loader?sourceMap', 'postcss-loader', 'sass-loader?sourceMap']
    })
  },
]

exports.MY_TEST_RULES = [
  // use this to import your own rules for Test webpack config.
]

exports.MY_TEST_PLUGINS = [
  // use this to import your own Test webpack config plugins.
]
