## Reference
   https://hackernoon.com/lets-start-with-webpack-4-91a0f1dba02e

## Installation
   npm init
   npm install webpack webpack-cli -D
   npm i html-webpack-plugin -D
   npm i webpack-dev-server -D
   npm i babel-loader @babel/core @babel/preset-env -D
   npm i css-loader style-loader -D
   npm i node-sass sass-loader -D
   npm i mini-css-extract-plugin -D
   npm i file-loader -D
   npm i copy-webpack-plugin -D
   npm i webpack-merge -D
   npm i cross-env -D
   npm i clean-webpack-plugin -D
   npm i uglifyjs-webpack-plugin -D
   npm i optimize-css-assets-webpack-plugin -D

   npm start, npm run build:dev, npm run build:prod

## Project Structure
   config:-
      webpack.common.config.js
      webpack.dev.config.js
      webpack.prod.config.js
   src:-
      app:-
        filename.js,
      assets:-
        images/
      styles:-
        scss/
      index.html
      index.js
      style.css
   package.json
   webpack.config.json

   # package.json:-
     "scripts": {
         "build:dev": "cross-env NODE_ENV=development webpack --mode development",
         "build:prod": "cross-env NODE_ENV=production webpack --mode production",
         "start": "webpack-dev-server --mode development",
      },

   # Working with html:- (html-webpack-plugin)
     For Putting html file into dist folder

     webpack.common.config.js
     const HtmlWebpackPlugin = require('html-webpack-plugin');
     plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack 4 Starter',
            template: './src/index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        })
      ]

      index.html
      <title> <%= htmlWebpackPlugin.options.title %> </title>

    # Resolving Common Extensions:-
      Sometimes we do not like to write extension while we import the modules(.ts or .js)

      webpack.common.config.js
      resolve: {extensions: ['.js', '.ts']}

    # Transpile ES6+ to ES5:-(optional)
      Here we are saying that match all the files which ends with .js and exclude node_modules.
      Babel-loader will actually transpile these modules/files to ES 5 using preset-env.

      webpack.common.config.js
      rules: [
          {
              test: [/.js$/],
              exclude: /(node_modules)/,
              use: {
                  loader: 'babel-loader',
                  options: {
                      presets: [
                          '@babel/preset-env'
                      ]
                  }
              }
          }
      ]

      src/app/header.js
      export class Header {
        constructor() {
          console.log(`This is header constructor`);
        }
        getFirstHeading() {
          return `Webpack Starter page`;
        }
      }

      src/index.js
      import { Header } from './app/header';
      let header = new Header();
      let firstHeading = header.getFirstHeading();
      console.log(firstHeading);

    # Working with css and scss
      For loading the CSS styles we need two loaders css-loader and style-loader.

      webpack.common.config.js
      const MiniCssExtractPlugin = require('mini-css-extract-plugin');
      rules: [
        {
          test: [/.css$|.scss$/],
          use:[
           MiniCssExtractPlugin.loader,
           'css-loader',
           'sass-loader'
          ]
        }
      ]
      plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.[chunkhash].css'
        })
      ]

      src/index.js
      import '../src/style.css';
      import './styles/scss/main.scss';

    # Loading Static Resources
      For loading static content we need a loader called file-loader.

      webpack.common.config.js
      const CopyWebpackPlugin = require('copy-webpack-plugin');
      rules: [
        {
          test: /\.(png|jpg|gif|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/images'
              }
            }
          ]
        }
      ]
      plugins: [
        new CopyWebpackPlugin([
          {
            from:'./src/assets/images',
            to:'assets/images'
          }
        ])
      ]

      src/index.js
      import webpackgif from './assets/images/webpack.gif';
      document.getElementById('webpack-gif').setAttribute('src', webpackgif);

      src/index.html
      <img id="webpack-gif" alt="webpack-gif">

    # Prepare resource for production

      webpack.prod.config.js
      const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
      const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

      module.exports = merge(webpackBaseConfig, {
        optimization: {
          minimizer: [
            new UglifyJsPlugin(),
            new OptimizeCSSAssetsPlugin()
          ]
        }
      });
