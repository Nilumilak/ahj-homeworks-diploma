const path = require('path')
const http = require('http')
const Koa = require('koa')
const cors = require('@koa/cors')
const { koaBody } = require('koa-body')
const koaStatic = require('koa-static')

const app = new Koa()
const router = require('./routes')

app.use(cors())

const publicFolder = path.join(__dirname, '/public')
app.use(koaStatic(publicFolder))

app.use(koaBody({
    urlencoded: true,
    multipart: true
}))

app.use(router())

const port = process.env.PORT || 7070
const server = http.createServer(app.callback())

server.listen(port)
