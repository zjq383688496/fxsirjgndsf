var env  = process.env.NODE_ENV || 'dev'
var root = __dirname

var config = {
	dev: {
	},
	qa: {
	},
	prev: {
	},
	prod: {
	},
}

var curConfig = config[env]
Object.assign(curConfig, {
	root,
	paths: {
		public: `${root}/public`,
		static: `${root}/static`,
	}
})

module.exports = curConfig