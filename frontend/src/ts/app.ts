import ChaosOrganizer from './ChaosOrganizer'
import ContentBoxWidget from './ContentBoxWidget'
import type { Post } from './types'

const SERVER_URL = 'http://localhost:7070'
export default SERVER_URL

document.addEventListener('DOMContentLoaded', () => {
    const navPanelEl = document.querySelector('.nav-panel') as HTMLElement
    const contentBoxEl = document.querySelector('.content') as HTMLUListElement
    const inputPanelEl = document.querySelector('.form-panel') as HTMLFormElement
    const chaosOrganizer = new ChaosOrganizer(navPanelEl, contentBoxEl, inputPanelEl)
    chaosOrganizer.init()

    const eventSource = new EventSource(`${SERVER_URL}/sse/`)

    eventSource.addEventListener('open', (e) => {
        console.log('sse open')
    })

    eventSource.addEventListener('error', (e) => {
        console.log('sse error')
    })

    eventSource.addEventListener('message', (e) => {
        const data: Post = JSON.parse(e.data)
        const contentBoxWidget = new ContentBoxWidget(contentBoxEl)
        void contentBoxWidget.createPost(data)
        contentBoxEl.scrollTo(0, contentBoxEl.scrollHeight)
    })
})
