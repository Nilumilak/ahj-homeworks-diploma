import type { GetResponse } from '../types'

export default class PostsApi {
    constructor (
        readonly apiURL: string
    ) {}

    async get (getParams: { nextLink?: string, search?: string }): Promise<GetResponse | undefined> {
        const { nextLink, search } = getParams
        let searchQuery = ''
        if (search && search !== '') {
            if (nextLink) {
                searchQuery = `&search=${search}`
            } else {
                searchQuery = `/?search=${search}`
            }
        }
        let url
        if (nextLink) {
            url = `${this.apiURL}${nextLink}${searchQuery}`
        } else {
            url = `${this.apiURL}/posts${searchQuery}`
        }
        try {
            const response = await fetch(url)
            const jsonResponse: GetResponse = await response.json()
            return jsonResponse
        } catch (err) {
            console.log(err)
        }
    }

    async post (data: string): Promise<void> {
        try {
            await fetch(`${this.apiURL}/posts`, {
                method: 'POST',
                body: JSON.stringify({ data }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    async postFile (data: FormData): Promise<void> {
        try {
            await fetch(`${this.apiURL}/posts/files`, {
                method: 'POST',
                body: data
            })
        } catch (err) {
            console.log(err)
        }
    }
}
