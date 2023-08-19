const { ImagePost } = require('../../db/db')

const Router = require('koa-router')

const router = new Router()

router.get('/images', (ctx) => {
    const { time } = ctx.request.query
    if (time) {
        const posts = ImagePost.get(time)
        if (posts.length !== 0) {
            const next = posts[posts.length - 1].time
            ctx.response.body = {
                posts,
                next: `/images/?time=${next}`,
                status: '200'
            }
            ctx.response.status = 200

            return
        }
        ctx.response.body = {
            posts,
            next: `/images/?time=${time}`,
            status: '200'
        }
        ctx.response.status = 200

        return
    }
    const posts = ImagePost.get()
    if (posts.length !== 0) {
        const next = posts[posts.length - 1].time
        ctx.response.body = {
            posts,
            next: `/images/?time=${next}`,
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
