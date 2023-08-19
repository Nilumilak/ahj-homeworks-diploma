import type ContentBoxWidget from './ContentBoxWidget'

export default class NavPanelWidget {
    readonly navPanelAnimation: HTMLDivElement
    private currentPanelItem: HTMLDivElement
    readonly categoriesButtonsEl: HTMLDivElement
    private currentCategory: [HTMLLabelElement, string]

    constructor (
        readonly navPanelEl: HTMLElement,
        readonly contentBoxWidget: ContentBoxWidget
    ) {
        this.navPanelAnimation = this.navPanelEl.querySelector('.nav-panel__animation') as HTMLDivElement
        this.currentPanelItem = this.navPanelEl.querySelector('.active') as HTMLDivElement
        this.categoriesButtonsEl = this.navPanelEl.querySelector('.categories__buttons') as HTMLDivElement
        this.currentCategory = [
            this.navPanelEl.querySelector('.categories__buttons__item.active') as HTMLLabelElement,
            ((this.navPanelEl.querySelector('.categories__buttons__item.active') as HTMLLabelElement).previousElementSibling as HTMLInputElement).id
        ]
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
                        } else if (htmlItemId === 'categories') {
                            void this.contentBoxWidget.fetchCategories(this.currentCategory[1])
                        }
                        this.currentPanelItem = navPanelItem

                        const inputFormEl = document.querySelector('.form-panel') as HTMLFormElement
                        const itemContentBoxEl = document.querySelector('.content') as HTMLUListElement
                        const itemMainEl = document.querySelector('.main') as HTMLElement
                        const categoriesButtonsEl = document.querySelector('.categories__buttons') as HTMLDivElement
                        if (htmlItemId === 'recents') {
                            inputFormEl.classList.add('active')
                            categoriesButtonsEl.classList.remove('active')
                            itemContentBoxEl.style.height = ''
                            itemMainEl.style.height = ''
                        } else if (htmlItemId === 'categories') {
                            inputFormEl.classList.remove('active')
                            categoriesButtonsEl.classList.add('active')
                            itemContentBoxEl.style.height = '80vh'
                            itemMainEl.style.height = '110vh'
                        } else {
                            inputFormEl.classList.remove('active')
                            categoriesButtonsEl.classList.remove('active')
                            itemContentBoxEl.style.height = '80vh'
                            itemMainEl.style.height = '110vh'
                        }
                    }
                }
            }
        })

        this.categoriesButtonsEl.addEventListener('click', (e) => {
            const target = e.target as HTMLLabelElement
            if (target.classList.contains('categories__buttons__item')) {
                const inputEl = target.previousElementSibling
                if (inputEl && this.currentCategory[0] !== target) {
                    this.contentBoxWidget.contentBoxEl.innerHTML = ''
                    this.contentBoxWidget.clearLinks()
                    this.currentCategory[0].classList.remove('active')
                    target.classList.add('active')
                    this.currentCategory[0] = target
                    const htmlItemId = inputEl.id
                    this.currentCategory[1] = htmlItemId
                }
                void this.contentBoxWidget.fetchCategories(this.currentCategory[1])
            }
        })
    }
}
