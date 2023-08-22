import ChaosOrganizer from './ChaosOrganizer'
import ContentBoxWidget from './ContentBoxWidget'
import type { Post } from './types'

const SERVER_URL = 'https://ahj-homeworks-diploma.onrender.com'
export default SERVER_URL

document.addEventListener('DOMContentLoaded', () => {
    const navPanelEl = document.querySelector('.nav-panel') as HTMLElement
    const contentBoxEl = document.querySelector('.content') as HTMLUListElement
    const inputPanelEl = document.querySelector('.form-panel') as HTMLFormElement
    const searchPanelEl = document.querySelector('.recents__search') as HTMLDivElement
    const chaosOrganizer = new ChaosOrganizer(navPanelEl, contentBoxEl, inputPanelEl, searchPanelEl)
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

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./serviceWorker.js', { scope: './' })
            .then((reg) => {
                console.log('Registration succeeded. Scope is ' + reg.scope)
            }).catch((err) => {
                console.log('registration failed with ' + String(err))
            })
    }
})
