var path = require('path')
var os   = require('os')

var base = [
	{
		test: /\.jsx?$/,
		use: [
			{
				loader: 'thread-loader',
				options: {
					workers: os.cpus().length
				}
			},
			'babel-loader'
		],
		exclude: /node_modules/,
		include: [].concat(
			[ path.join(__dirname, '/../src') ]
		)
	},
]
var dev = [
	{
		test: /\.css/,
		loader: 'style-loader!css-loader'
	},
	{
		test: /\.less/,
		loader: 'style-loader?sourceMap=true!css-loader?sourceMap=true!less-loader?sourceMap=true&javascriptEnabled=true'
	},
	{
		test: /\.(jpe?g|png|gif|svg|ttf|woff2?|eot|otf)\??.*$/,
		loader: 'url-loader?name=[path][name]_[hash:8].[ext]'
	}
]

module.exports = {
	dev: [ ...base, ...dev ]
}