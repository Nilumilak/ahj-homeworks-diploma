import PostsApi from './api/PostsApi'
import FavoritesApi from './api/FavoritesApi'
import SERVER_URL from './app'
import type { Post, GetResponse } from './types'

export default class ContentBoxWidget {
    private scrollTimeoutFunction: NodeJS.Timeout | null
    private nextLinkPosts: string | undefined
    private nextLinkFavorites: string | undefined
    readonly postsApi: PostsApi
    readonly favoritesApi: FavoritesApi

    constructor (
        readonly contentBoxEl: HTMLUListElement
    ) {
        this.scrollTimeoutFunction = null
        this.nextLinkPosts = undefined
        this.nextLinkFavorites = undefined
        this.postsApi = new PostsApi(SERVER_URL)
        this.favoritesApi = new FavoritesApi(SERVER_URL)
    }

    init (): void {
        this.setHandlers()
        void this.fetchPosts()
    }

    setHandlers (): void {
        this.contentBoxEl.addEventListener('scroll', (e) => {
            if (this.scrollTimeoutFunction) {
                clearTimeout(this.scrollTimeoutFunction)
            }

            this.scrollTimeoutFunction = setTimeout(() => {
                const lastPost: HTMLLIElement = this.contentBoxEl.lastChild as HTMLLIElement
                if (lastPost) {
                    const { top: topLastEl } = lastPost.getBoundingClientRect()
                    const { top: topContentEl } = this.contentBoxEl.getBoundingClientRect()
                    if (topContentEl - 10 < topLastEl) {
                        if (this.nextLinkPosts) {
                            void this.fetchPosts()
                        } else if (this.nextLinkFavorites) {
                            void this.fetchFavorites()
                        }
                    }
                }
            }, 500)
        })
    }

    async fetchPosts (): Promise<void> {
        let responseData
        if (this.nextLinkPosts) {
            responseData = await this.postsApi.get(this.nextLinkPosts)
        } else {
            responseData = await this.postsApi.get()
        }
        if (responseData) {
            this.addPostsToContentBox(responseData)
            this.nextLinkPosts = responseData.next
            this.nextLinkFavorites = undefined
        }
    }

    async fetchFavorites (): Promise<void> {
        let responseData
        if (this.nextLinkFavorites) {
            responseData = await this.favoritesApi.get(this.nextLinkFavorites)
        } else {
            responseData = await this.favoritesApi.get()
        }
        if (responseData) {
            this.addPostsToContentBox(responseData)
            this.nextLinkFavorites = responseData.next
            this.nextLinkPosts = undefined
        }
    }

    addPostsToContentBox (responseData: GetResponse): void {
        const posts = responseData.posts
        let startPosition = -80
        posts.forEach(post => {
            startPosition -= 20
            void this.createPost(post, `${startPosition}%`)
        })
    }

    async createPost (post: Post, startPosition: string | null = null): Promise<void> {
        const li = document.createElement('li')
        li.classList.add('content__item')
        if (startPosition) {
            li.style.right = startPosition
        }

        const favoriteSvg = this.createSvgImage(post.isFavorite)
        li.appendChild(favoriteSvg)

        favoriteSvg.addEventListener('click', () => {
            favoriteSvg.classList.toggle('active')
            void this.favoritesApi.post(post.time)
        })

        const divTime = document.createElement('div')
        divTime.classList.add('content__item__time')
        const date = new Date(Number(post.time))
        divTime.textContent = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
        li.appendChild(divTime)
        li.dataset.time = post.time

        let dataFileEl
        if (post.isFile) {
            const filePath = post.data
            dataFileEl = document.createElement('a')
            dataFileEl.classList.add('content__item__file-data')
            dataFileEl.download = filePath.split('/').at(-1) ?? 'file'
            dataFileEl.textContent = post.data.split('/').at(-1) ?? ''
            dataFileEl.appendChild(this.createSvgFileImage())
            li.appendChild(dataFileEl)
        } else {
            const dataEl = document.createElement('div')
            dataEl.classList.add('content__item__data')
            dataEl.innerHTML = post.data.replace(/(https?:[^\s]+)/, '<a href="$1">$1</a>')
            li.appendChild(dataEl)
        }

        startPosition ? this.contentBoxEl.appendChild(li) : this.contentBoxEl.insertBefore(li, this.contentBoxEl.firstChild)
        if (post.isFile && dataFileEl) {
            const response = await fetch(`${SERVER_URL}${post.data}`)
            const blobData = await response.blob()
            dataFileEl.href = URL.createObjectURL(blobData)
        }
    }

    createSvgImage (isFavorite: boolean): SVGSVGElement {
        const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        iconSvg.classList.add('content__item__favorite')
        const iconPath = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        )

        iconSvg.setAttribute('viewBox', '0 -960 960 960')
        iconSvg.setAttribute('height', '24')
        iconSvg.setAttribute('width', '24')

        if (isFavorite) {
            iconSvg.classList.add('active')
        }

        iconSvg.appendChild(iconPath)

        return iconSvg
    }

    createSvgFileImage (): SVGSVGElement {
        const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        const iconPath = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        )

        iconSvg.setAttribute('viewBox', '0 -960 960 960')
        iconSvg.setAttribute('height', '40')
        iconSvg.setAttribute('width', '40')

        iconSvg.appendChild(iconPath)

        return iconSvg
    }

    clearLinks (): void {
        this.nextLinkPosts = undefined
        this.nextLinkFavorites = undefined
    }
}
