const combineRouters = require('koa-combine-routers')

const posts = require('./posts')
const favorites = require('./favorites')
const sse = require('./sse')

const router = combineRouters(posts, favorites, sse)

module.exports = router
