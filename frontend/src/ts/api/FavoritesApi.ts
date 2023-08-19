import type { GetResponse } from '../types'

export default class FavoritesApi {
    constructor (
        readonly apiURL: string
    ) {}

    async get (nextLink: string | null = null): Promise<GetResponse | undefined> {
        let url
        if (nextLink) {
            url = `${this.apiURL}${nextLink}`
        } else {
            url = `${this.apiURL}/favorites`
        }
        try {
            const response = await fetch(url)
            const jsonResponse: GetResponse = await response.json()
            return jsonResponse
        } catch (err) {
            console.log(err)
        }
    }

    async post (time: string): Promise<void> {
        try {
            await fetch(`${this.apiURL}/favorites`, {
                method: 'POST',
                body: JSON.stringify({ time }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (err) {
            console.log(err)
        }
    }
}
