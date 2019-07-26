const Koa        = require('koa')
const app        = new Koa()
const json       = require('koa-json')
const onerror    = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger     = require('koa-logger')
const static     = require('koa-static')

const { paths }   = require('./config')

// 错误处理
onerror(app)

// 中间件
app.use(bodyparser({
	enableTypes:['json', 'form', 'text'],
	formLimit: '5mb',
	jsonLimit: '5mb',
	textLimit: '5mb',
}))
app.use(json())
app.use(logger())
app.use(static(paths.public))
app.use(static(paths.static))

// 路由
require('./config.routes')(app)

// error-handling
app.on('error', (err, ctx) => {
	console.error('服务器 错误', err, ctx)
})

module.exports = app
