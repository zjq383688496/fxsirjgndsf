var path     = require('path')
var os       = require('os')
var pathRoot = process.cwd()
var webpack  = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

console.log(`pathRoot: ${pathRoot}`)

module.exports = {
	entry: path.resolve('./index.js'),
	// output: {
	// 	libraryTarget: 'var',
	// 	path: path.resolve(pathRoot, './dist/'),
	// 	publicPath: '/',
	// 	filename: '[name]_[hash:8].js',
	// 	chunkFilename: '[name]_[hash:8].js'
	// },
	
	plugins: [
		new CopyWebpackPlugin([
			{ from: './src/static/svg.js', to: 'static/svg.js' },
			{ from: './src/static/svg.draggable.js', to: 'static/svg.draggable.js' }
		]),

		new HtmlWebpackPlugin({
			inject: 'body',
			template: './src/index.html',
			filename: 'index.html'
		})

		// new webpack.NoErrorsPlugin()
	],

	module: {},

	resolve: {
		modules: [
			'node_modules',
			path.resolve(pathRoot)
		],
		extensions: ['.js', '.json', '.jsx'],
		alias: {
			'@comp':    'src/component',
			'@modular': 'src/modular',
			'@store':   'src/store',
			'@utils':   'src/utils',
			'actions':  'src/store/actions',
			'assets':   'src/assets',
			'@state':   'src/store/state',
			'@var':     'src/store/var',
			'@svg':     'src/svg',
		}
	},

	optimization: {
		runtimeChunk: true,
		splitChunks: {
			chunks: 'all'
		}
	}
}