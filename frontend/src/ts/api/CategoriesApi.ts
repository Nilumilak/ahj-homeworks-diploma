import type { GetResponse } from '../types'

export default class CategoriesApi {
    constructor (
        readonly apiURL: string
    ) {}

    async get (category: string, nextLink: string | null = null): Promise<GetResponse | undefined> {
        let url
        if (nextLink) {
            url = `${this.apiURL}${nextLink}`
        } else {
            url = `${this.apiURL}/${category}`
        }
        try {
            const response = await fetch(url)
            const jsonResponse: GetResponse = await response.json()
            return jsonResponse
        } catch (err) {
            console.log(err)
        }
    }
}
