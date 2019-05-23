const path = require('path');
const nodeExternals = require('webpack-node-externals');

const serverConfig = {
  context: __dirname,
  name: 'server',
  target: 'node',
  entry: {
    server: ['@babel/polyfill', './server/index.ts'],
  },
  output: {
    path: path.resolve(__dirname, '.next/server'),
    filename: 'index.js',
    chunkFilename: 'chunks/[name].js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, 'config'),
      '@server': path.resolve(__dirname, 'server'),
    },
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: 'current',
                  },
                  modules: false,
                  useBuiltIns: false,
                  debug: false,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.server.json'),
          reportFiles: 'server/**/*.ts',
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  externals: [nodeExternals()],
  devtool: 'source-map',

  // Do not replace node globals with polyfills
  // https://webpack.js.org/configuration/node/
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
};

module.exports = serverConfig;
