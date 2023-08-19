import type { GetResponse } from '../types'

export default class PostsApi {
    constructor (
        readonly apiURL: string
    ) {}

    async get (nextLink: string | null = null): Promise<GetResponse | undefined> {
        let url
        if (nextLink) {
            url = `${this.apiURL}${nextLink}`
        } else {
            url = `${this.apiURL}/posts`
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
