var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var pkg = require('./package.json');
var CleanWebpackPlugin  = require('clean-webpack-plugin');

var config = {
  entry: {
    main: path.join(__dirname,'index.js'),
    background: path.join(__dirname,'js/background.js'),
    vendor: Object.keys(pkg.dependencies)

  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
      //publicPath: '../build/',
      // chunkFilename: '[id].chunk.js'
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file'
    }, {
      test: /\.(png|jpe?g|gif)$/,
      loader: 'url?limit=8192&name=img/[hash:8].[ext]'
    }]
  },
  devServer: {
			// enble history api fallback to HTML5 History
			// API based
			// routing works.This is a good defualt that wil
			// come in handy in more complicated setups
			historyApiFallback: true,
			hot: true,
			inline: true,

			// display onlu errors to reduce the amount of output
			stats: 'errors-only',
			host: '127.0.0.1',
			port: 9000
		},
  plugins: [
    new CleanWebpackPlugin(['build'],{
      root:process.cwd()
    }),
    new webpack.optimize.UglifyJsPlugin({
        // Don't beautify output (enable for neater output)
        beautify: false,

        // Eliminate comments
        comments: false,

        // Compression specific options
        compress: {

          warnings: false,

          // Drop `console` statements
          drop_console: true
        },

        // Mangling specific options
        mangle: {
          // Don't mangle $
          except: ['$'],

          // Don't care about IE8
          screw_ie8 : true,

          // Don't mangle function names
          keep_fnames: true
         }
      }),
  	new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors' // 将公共模块提取，生成名为`vendors`的chunk
    }),
		new HtmlWebpackPlugin({
		title:'chrome extensions',
    	template: path.join(__dirname, 'popup.html')
	})

]};

module.exports = config;
