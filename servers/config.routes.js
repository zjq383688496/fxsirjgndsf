const config = require('./config')

const sql = require('./routes/sql')

module.exports = app => {
	// 允许跨域
	// 添加请求处理时间(ms)
	app.use(async (ctx, next) => {
		const start = Date.now()
		ctx.set('Access-Control-Allow-Credentials', true)
		ctx.set('Access-Control-Allow-Headers', '*')
		// ctx.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, x-access-token')
		ctx.set('Access-Control-Allow-Origin',  '*')
		ctx.set('Access-Control-Allow-Methods', 'GET, POST')
		ctx.set('Access-Control-Max-Age', 3600)
		if (ctx.method === 'OPTIONS') return ctx.body = ''
		ctx.cfg = config
		await next()
		const ms = Date.now() - start
		ctx.set('x-execute-time', `${ctx.method} ${ctx.url} - ${ms}ms`)
	})
	
	app.use(sql.routes(), sql.allowedMethods())
}
