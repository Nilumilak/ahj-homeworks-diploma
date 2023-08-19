const combineRouters = require('koa-combine-routers')

const posts = require('./posts')
const favorites = require('./favorites')
const images = require('./images')
const audios = require('./audios')
const videos = require('./videos')
const codes = require('./codes')
const sse = require('./sse')

const router = combineRouters(posts, favorites, codes, images, audios, videos, sse)

module.exports = router
