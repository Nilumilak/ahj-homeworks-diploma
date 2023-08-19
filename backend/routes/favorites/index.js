const { Favorites } = require('../../db/db')

const Router = require('koa-router')

const router = new Router()

router.get('/favorites', (ctx) => {
    const { time } = ctx.request.query
    if (time) {
        const posts = Favorites.get(time)
        if (posts.length !== 0) {
            const next = posts[posts.length - 1].time
            ctx.response.body = {
                posts,
                next: `/favorites/?time=${next}`,
                status: '200'
            }
            ctx.response.status = 200

            return
        }
        ctx.response.body = {
            posts,
            next: `/favorites/?time=${time}`,
            status: '200'
        }
        ctx.response.status = 200

        return
    }
    const posts = Favorites.get()
    if (posts.length !== 0) {
        const next = posts[posts.length - 1].time
        ctx.response.body = {
            posts,
            next: `/favorites/?time=${next}`,
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

router.post('/favorites', (ctx) => {
    const requestBody = ctx.request.body

    if (!requestBody) {
        ctx.response.body = {
            error: 'field "time" is required',
            status: '400'
        }
        ctx.response.status = 400

        return
    }

    const { time } = requestBody

    const post = Favorites.post(time)
    if (post) {
        ctx.response.body = {
            post,
            status: '201'
        }
        ctx.response.status = 201

        return
    }
    ctx.response.body = {
        error: 'post with provided time was not found',
        status: '400'
    }
    ctx.response.status = 400
})

module.exports = router
