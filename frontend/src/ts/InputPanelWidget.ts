import PostsApi from './api/PostsApi'
import SERVER_URL from './app'

export default class InputPanelWidget {
    readonly attachFileLabelEl: HTMLLabelElement
    readonly attachFileInput: HTMLInputElement
    readonly mainContainer: HTMLElement
    readonly dragAndDropPopup: HTMLDivElement
    readonly recentNavPanel: HTMLDivElement
    readonly postsApi: PostsApi

    constructor (
        readonly inputPanelEl: HTMLFormElement
    ) {
        this.attachFileLabelEl = this.inputPanelEl.querySelector('.attach-file') as HTMLLabelElement
        this.attachFileInput = this.inputPanelEl.querySelector('.attach-file__input') as HTMLInputElement
        this.postsApi = new PostsApi(SERVER_URL)
        this.mainContainer = document.querySelector('.main') as HTMLElement
        this.dragAndDropPopup = document.querySelector('.drag-drop-popup') as HTMLDivElement
        this.recentNavPanel = (document.querySelector('.nav-panel') as HTMLElement).firstElementChild as HTMLDivElement
    }

    init (): void {
        this.setHandlers()
    }

    setHandlers (): void {
        this.inputPanelEl.addEventListener('submit', (e) => {
            e.preventDefault()
            const inputEl = (e.target as HTMLFormElement).querySelector('.form-panel_input') as HTMLInputElement
            const value = inputEl.value.trim()
            if (value !== '') {
                void this.postsApi.post(inputEl.value)
            }
            inputEl.value = ''
        })

        this.attachFileInput.addEventListener('change', () => {
            this.sendFilesToServer()
        })

        this.mainContainer.addEventListener('dragover', (e) => {
            e.preventDefault()
            if (this.recentNavPanel.classList.contains('active')) {
                this.dragAndDropPopup.style.opacity = '0.4'
            }
        })

        this.mainContainer.addEventListener('dragleave', (e) => {
            e.preventDefault()
            this.dragAndDropPopup.style.opacity = ''
        })

        this.mainContainer.addEventListener('drop', (e) => {
            e.preventDefault()
            if (this.recentNavPanel.classList.contains('active')) {
                if (e.dataTransfer) {
                    this.attachFileInput.files = e.dataTransfer.files
                }
                this.sendFilesToServer()
                this.dragAndDropPopup.style.opacity = ''
            }
        })
    }

    sendFilesToServer (): void {
        const formData = new FormData(this.inputPanelEl)
        void this.postsApi.postFile(formData)
    }
}
