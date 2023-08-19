const listeners = []

class Listeners {
    static listen (handler) {
        listeners.push(handler)
    }
}

let allPosts = []

class Posts {
    constructor (data, isFile = false) {
        this.data = data
        this.time = Date.now().toString()
        this.isFavorite = false
        this.isFile = isFile
    }

    static get (time = null) {
        let start, end
        if (!time) {
            start = 0
            end = 10
        } else {
            start = allPosts.findIndex((message) => message.time === time) + 1
            end = start + 10
        }
        return allPosts.slice(start, end)
    }

    static post (data) {
        const post = new Posts(data)
        allPosts = [post].concat(allPosts)

        listeners.forEach(handler => handler(post))

        return post
    }

    static postFile (data) {
        const post = new Posts(data, true)
        allPosts = [post].concat(allPosts)

        listeners.forEach(handler => handler(post))

        return post
    }
}

class Favorites {
    static allFavorites = []

    static get (time = null) {
        let start, end
        if (!time) {
            start = 0
            end = 10
        } else {
            start = this.allFavorites.findIndex((message) => message.time === time) + 1
            end = start + 10
        }
        return this.allFavorites.slice(start, end)
    }

    static post (time) {
        const post = allPosts.find((message) => message.time === time)
        this.allFavorites = post.isFavorite ? this.allFavorites.filter(el => el !== post) : [post].concat(this.allFavorites)
        post.isFavorite = !post.isFavorite
        return post
    }
}

module.exports = { Listeners, Posts, Favorites }
