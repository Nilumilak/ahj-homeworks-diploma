export type Post = {
    data: string
    time: string
    isFavorite: boolean
    isFile: boolean
    type: string
}

export type GetResponse = {
    posts: Post[]
    status: string
    next?: string
}
