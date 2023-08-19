const Router = require('koa-router')
const { streamEvents } = require('http-event-stream')
const { v4 } = require('uuid')
const { Listeners } = require('../../db/db')

const router = new Router()

router.get('/sse', async (ctx) => {
    streamEvents(ctx.req, ctx.res, {
        async fetch (lastEventId) {
            console.log(lastEventId)
        },
        async stream (sse) {
            Listeners.listen((item) => {
                sse.sendEvent({
                    id: v4(),
                    data: JSON.stringify(item)
                })
            })
        }
    })

    ctx.respond = false
})

module.exports = router
