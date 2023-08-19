const { VideoPost } = require('../../db/db')

const Router = require('koa-router')

const router = new Router()

router.get('/videos', (ctx) => {
    const { time } = ctx.request.query
    if (time) {
        const posts = VideoPost.get(time)
        if (posts.length !== 0) {
            const next = posts[posts.length - 1].time
            ctx.response.body = {
                posts,
                next: `/videos/?time=${next}`,
                status: '200'
            }
            ctx.response.status = 200

            return
        }
        ctx.response.body = {
            posts,
            next: `/videos/?time=${time}`,
            status: '200'
        }
        ctx.response.status = 200

        return
    }
    const posts = VideoPost.get()
    if (posts.length !== 0) {
        const next = posts[posts.length - 1].time
        ctx.response.body = {
            posts,
            next: `/videos/?time=${next}`,
            status: '200'
        }
        ctx.response.status = 200

        return
    }
    ctx.response.body = {
        posts,
        status: '200'
    }
    ctx.response.status = 200
})

module.exports = router
