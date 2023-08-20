import NavPanelWidget from './NavPanelWidget'
import ContentBoxWidget from './ContentBoxWidget'
import InputPanelWidget from './InputPanelWidget'
import SeachPanelWidget from './SearchPanelWidget'

export default class ChaosOrganizer {
    constructor (
        readonly navPanelEl: HTMLElement,
        readonly contentBoxEl: HTMLUListElement,
        readonly inputPanelEl: HTMLFormElement,
        readonly searchPanelEl: HTMLDivElement
    ) {}

    init (): void {
        const contentBoxWidget = new ContentBoxWidget(this.contentBoxEl)
        contentBoxWidget.init()
        const navPanelWidget = new NavPanelWidget(this.navPanelEl, contentBoxWidget)
        navPanelWidget.init()
        const inputPanelWidget = new InputPanelWidget(this.inputPanelEl)
        inputPanelWidget.init()
        const seachPanelWidget = new SeachPanelWidget(this.searchPanelEl, contentBoxWidget)
        seachPanelWidget.init()
    }
}
