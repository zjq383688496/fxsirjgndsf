const router = require('koa-router')()

function a(ctx, next) {
    debugger
}

router.prefix('/find')

router.post('/create', a)

module.exports = router