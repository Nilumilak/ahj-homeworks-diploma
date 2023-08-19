import type ContentBoxWidget from './ContentBoxWidget'

export default class NavPanelWidget {
    readonly navPanelAnimation: HTMLDivElement
    private currentPanelItem: HTMLDivElement
    constructor (
        readonly navPanelEl: HTMLElement,
        readonly contentBoxWidget: ContentBoxWidget
    ) {
        this.navPanelAnimation = this.navPanelEl.querySelector('.nav-panel__animation') as HTMLDivElement
        this.currentPanelItem = this.navPanelEl.querySelector('.active') as HTMLDivElement
    }

    init (): void {
        this.sethandlers()
    }

    sethandlers (): void {
        this.navPanelEl.addEventListener('click', (e) => {
            const target = e.target as HTMLLabelElement
            if (target.classList.contains('nav-panel__item-label')) {
                const navPanelItem = target.closest('.nav-panel__item') as HTMLDivElement
                if (navPanelItem) {
                    this.currentPanelItem.classList.remove('active')
                    const htmlItemId = (navPanelItem.querySelector('input') as HTMLInputElement).id
                    const currentClass = this.navPanelAnimation.classList[1]
                    this.navPanelAnimation.classList.replace(currentClass, htmlItemId)
                    navPanelItem.classList.add('active')

                    if (!this.currentPanelItem.classList.contains('active')) {
                        this.contentBoxWidget.contentBoxEl.innerHTML = ''
                        this.contentBoxWidget.clearLinks()
                        if (htmlItemId === 'recents') {
                            void this.contentBoxWidget.fetchPosts()
                        } else if (htmlItemId === 'favorites') {
                            void this.contentBoxWidget.fetchFavorites()
                        }
                        this.currentPanelItem = navPanelItem

                        const inputFormEl = document.querySelector('.form-panel') as HTMLFormElement
                        const itemContentBoxEl = document.querySelector('.content') as HTMLUListElement
                        const itemMainEl = document.querySelector('.main') as HTMLElement
                        if (htmlItemId === 'recents') {
                            inputFormEl.classList.add('active')
                            itemContentBoxEl.style.height = ''
                            itemMainEl.style.height = ''
                        } else {
                            inputFormEl.classList.remove('active')
                            itemContentBoxEl.style.height = '80vh'
                            itemMainEl.style.height = '110vh'
                        }
                    }
                }
            }
        })
    }
}
