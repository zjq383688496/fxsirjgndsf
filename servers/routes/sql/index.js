const router = require('koa-router')()

const find = require('./find')

router.prefix('/sql')

router.get('/find', ctx => {
	ctx.body = { name: '庄家琪' }
})

module.exports = router