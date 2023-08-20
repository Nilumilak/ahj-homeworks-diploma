import type ContentBoxWidget from './ContentBoxWidget'

export default class SeachPanelWidget {
    readonly searchInput: HTMLInputElement

    constructor (
        readonly searchPanelEl: HTMLDivElement,
        readonly contentBoxWidget: ContentBoxWidget
    ) {
        this.searchInput = this.searchPanelEl.querySelector('.recents__search__input') as HTMLInputElement
    }

    init (): void {
        this.setHandlers()
    }

    setHandlers (): void {
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const searchValue = this.searchInput.value
                if (searchValue !== this.contentBoxWidget.currentSearch) {
                    this.contentBoxWidget.contentBoxEl.innerHTML = ''
                    this.contentBoxWidget.clearLinks()
                    this.contentBoxWidget.currentSearch = searchValue
                    void this.contentBoxWidget.fetchPosts()
                }
            }
        })
    }
}
