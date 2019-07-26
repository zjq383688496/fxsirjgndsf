const router = require('koa-router')()

function a(argument) {}

router.prefix('/find')

router.get('/create', a)

module.exports = router