const { AudioPost } = require('../../db/db')

const Router = require('koa-router')

const router = new Router()

router.get('/audios', (ctx) => {
    const { time } = ctx.request.query
    if (time) {
        const posts = AudioPost.get(time)
        if (posts.length !== 0) {
            const next = posts[posts.length - 1].time
            ctx.response.body = {
                posts,
                next: `/audios/?time=${next}`,
                status: '200'
            }
            ctx.response.status = 200

            return
        }
        ctx.response.body = {
            posts,
            next: `/audios/?time=${time}`,
            status: '200'
        }
        ctx.response.status = 200

        return
    }
    const posts = AudioPost.get()
    if (posts.length !== 0) {
        const next = posts[posts.length - 1].time
        ctx.response.body = {
            posts,
            next: `/audios/?time=${next}`,
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
