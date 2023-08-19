const path = require('path')
const uuid = require('uuid')
const fs = require('fs')
const { Posts } = require('../../db/db')

const Router = require('koa-router')

const router = new Router()

router.get('/posts', (ctx) => {
    const { time } = ctx.request.query
    if (time) {
        const posts = Posts.get(time)
        if (posts.length !== 0) {
            const next = posts[posts.length - 1].time
            ctx.response.body = {
                posts,
                next: `/posts/?time=${next}`,
                status: '200'
            }
            ctx.response.status = 200

            return
        }
        ctx.response.body = {
            posts,
            next: `/posts/?time=${time}`,
            status: '200'
        }
        ctx.response.status = 200

        return
    }
    const posts = Posts.get()
    if (posts.length !== 0) {
        const next = posts[posts.length - 1].time
        ctx.response.body = {
            posts,
            next: `/posts/?time=${next}`,
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

router.post('/posts', (ctx) => {
    const requestBody = ctx.request.body

    if (!requestBody) {
        ctx.response.body = {
            error: 'field "data" is required',
            status: '400'
        }
        ctx.response.status = 400

        return
    }

    const { data } = requestBody

    const post = Posts.post(data)
    ctx.response.body = {
        post: JSON.stringify(post),
        status: '201'
    }
    ctx.response.status = 201
})

router.post('/posts/files', (ctx) => {
    const requestFile = ctx.request.files

    if (!requestFile) {
        ctx.response.body = {
            error: 'file is required',
            status: '400'
        }
        ctx.response.status = 400

        return
    }

    try {
        const publicFolder = path.join(__dirname, '/../../public')
        const { file } = requestFile
        if (file instanceof Array) {
            file.forEach(item => {
                saveRequestFileAndSendResponse(item, publicFolder, ctx)
            })
        } else {
            saveRequestFileAndSendResponse(file, publicFolder, ctx)
        }
    } catch (err) {
        console.log(err)
        ctx.response.status = 500
    }
})

function saveRequestFileAndSendResponse (file, publicFolder, ctx) {
    const subfolder = uuid.v4()
    fs.mkdirSync(`${publicFolder}/${subfolder}`)
    fs.copyFileSync(file.filepath, `${publicFolder}/${subfolder}/${file.originalFilename}`)

    const fileName = `/${subfolder}/${file.originalFilename}`
    const post = Posts.postFile(fileName)
    ctx.response.body = {
        post,
        status: '201'
    }
    ctx.response.status = 201
}

module.exports = router
