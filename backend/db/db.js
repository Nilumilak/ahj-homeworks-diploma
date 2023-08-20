const listeners = []

class Listeners {
    static listen (handler) {
        listeners.push(handler)
    }
}

const EXTENSIONS = {
    IMAGE: ['jpg', 'jpeg', 'png', 'svg'],
    VIDEO: ['mp4', 'avi', 'mkv'],
    AUDIO: ['mp3', 'wav', 'wma'],
    CODE: ['js', 'ts', 'py', 'css', 'html']
}

let allPosts = []

class Posts {
    constructor (data, isFile = false, type = 'text') {
        this.data = data
        this.time = Date.now().toString()
        this.isFavorite = false
        this.isFile = isFile
        this.type = type
    }

    static get ({ time = null, search = undefined }) {
        let start, end
        let getPosts = allPosts
        if (search) {
            getPosts = getPosts.filter((post) => {
                if (post.type !== 'text') {
                    const data = /\/([^/]+$)/.exec(post.data)[1]
                    return data.includes(search)
                }
                return post.data.includes(search)
            })
        }
        if (!time) {
            start = 0
            end = 10
        } else {
            start = getPosts.findIndex((post) => post.time === time) + 1
            end = start + 10
        }
        return getPosts.slice(start, end)
    }

    static post (data) {
        const post = new Posts(data)
        allPosts = [post].concat(allPosts)

        listeners.forEach(handler => handler(post))

        return post
    }

    static postFile (data) {
        const extension = /\.(\w+)$/.exec(data)[1]

        let post
        if (EXTENSIONS.IMAGE.includes(extension)) {
            post = ImagePost.post(data)
        } else if (EXTENSIONS.AUDIO.includes(extension)) {
            post = AudioPost.post(data)
        } else if (EXTENSIONS.VIDEO.includes(extension)) {
            post = VideoPost.post(data)
        } else if (EXTENSIONS.CODE.includes(extension)) {
            post = CodePost.post(data)
        } else {
            post = new Posts(data, true, 'other')
        }

        allPosts = [post].concat(allPosts)
        listeners.forEach(handler => handler(post))

        return post
    }
}

class PostTypeBaseClass {
    static AllPosts = []

    static get (time = null) {
        let start, end
        if (!time) {
            start = 0
            end = 10
        } else {
            start = this.AllPosts.findIndex((message) => message.time === time) + 1
            end = start + 10
        }
        return this.AllPosts.slice(start, end)
    }
}

class Favorites extends PostTypeBaseClass {
    static post (time) {
        const post = allPosts.find((message) => message.time === time)
        this.AllPosts = post.isFavorite ? this.AllPosts.filter(el => el !== post) : [post].concat(this.AllPosts)
        post.isFavorite = !post.isFavorite
        return post
    }
}

class ImagePost extends PostTypeBaseClass {
    static post (data) {
        const post = new Posts(data, true, 'image')
        this.AllPosts = [post].concat(this.AllPosts)
        return post
    }
}

class AudioPost extends PostTypeBaseClass {
    static post (data) {
        const post = new Posts(data, true, 'audio')
        this.AllPosts = [post].concat(this.AllPosts)
        return post
    }
}

class VideoPost extends PostTypeBaseClass {
    static post (data) {
        const post = new Posts(data, true, 'video')
        this.AllPosts = [post].concat(this.AllPosts)
        return post
    }
}

class CodePost extends PostTypeBaseClass {
    static post (data) {
        const post = new Posts(data, true, 'code')
        this.AllPosts = [post].concat(this.AllPosts)
        return post
    }
}

module.exports = { Listeners, Posts, Favorites, ImagePost, AudioPost, VideoPost, CodePost }
