import React, { ReactElement } from "react"
import ReactDOM from "react-dom"
import { IntlProvider } from "react-intl"
import { Provider } from "react-redux"
import { Router } from "react-router"
import {
  ModalBackdrop,
  ModalWrapper,
} from "Renderer/components/modal/modal.component"
import localeEn from "Renderer/locales/main/en-US.json"
import history from "Renderer/routes/history"
import { Store } from "Renderer/store"

enum ModalError {
  NO_MODAL_TO_CLOSE = "Close modal action cannot be performed. There is no modal opened.",
  CLOSING_FORBIDDEN = "Cannot close current modal. If you really want to close it, use force parameter or call allowClosingModal(true) method.",
  ANOTHER_MODAL_OPENED = "Another modal is already opened. If you really want to open another one, use force parameter.",
}

const logError = (message: ModalError) => {
  console.warn(`Modal error: ${message}`)
}

interface EventListeners {
  type: string
  element: Node
  event: () => void
}

class ModalService {
  private store?: Store
  private defaultLocale?: string
  private modalElement: HTMLDivElement | null = null
  private backdropElement: HTMLDivElement | null = null
  private modalOpen: boolean = false
  private backdropOpen: boolean = false
  private allowClosing: boolean = true
  private closeBackdrop: boolean = true
  private eventListeners: EventListeners[] = []

  public bindStore(value: Store) {
    this.store = value
  }

  public setDefaultLocale(value: string) {
    this.defaultLocale = value
  }

  public isModalOpen() {
    return this.modalOpen && this.backdropOpen
  }

  public async closeModal(force: boolean = false) {
    if (!this.isModalOpen()) {
      logError(ModalError.NO_MODAL_TO_CLOSE)
      return
    }
    if (!this.allowClosing && !force) {
      logError(ModalError.CLOSING_FORBIDDEN)
      return
    }

    const animationEndPromise = (element: HTMLElement) => {
      return new Promise(resolve => {
        const child = element.firstChild as HTMLElement
        child.style.animationName = "fadeOut"
        this.registerEventListener("webkitAnimationEnd", child, () => {
          resolve()
        })
      })
    }

    const { modalElement, backdropElement, modalOpen } = this

    if (modalElement && backdropElement && modalOpen) {
      const modalPromise = animationEndPromise(modalElement)
      const allPromises = [modalPromise]

      if (this.closeBackdrop) {
        const backdropPromise = animationEndPromise(backdropElement)
        allPromises.push(backdropPromise)
      }

      await Promise.all(allPromises)

      this.unMountModal()
      this.unregisterEventListener(
        "webkitAnimationEnd",
        modalElement.firstChild!
      )

      if (this.closeBackdrop) {
        this.unMountBackdrop()
        this.unregisterEventListener(
          "webkitAnimationEnd",
          backdropElement.firstChild!
        )
      }
    }
    this.closeBackdrop = true
  }

  public async openModal(modal: ReactElement, force: boolean = false) {
    if (this.isModalOpen()) {
      if (force) {
        this.closeBackdrop = false
        await this.closeModal(true)
      } else {
        logError(ModalError.ANOTHER_MODAL_OPENED)
        return
      }
    }
    this.allowClosingModal(true)
    this.mountBackdrop()
    this.renderBackdrop()
    this.mountModal()
    this.renderModal(modal)
  }

  public allowClosingModal(allow: boolean = true) {
    this.allowClosing = allow
  }

  private registerEventListener(
    type: EventListeners["type"],
    element: EventListeners["element"],
    event: EventListeners["event"]
  ) {
    this.eventListeners.push({ type, element, event })
    element.addEventListener(type, event)
  }

  private unregisterEventListener(
    type: EventListeners["type"],
    element: EventListeners["element"]
  ) {
    const eventIndex = this.eventListeners.findIndex(
      ({ type: eventType, element: eventElement }) =>
        eventElement === element && eventType === type
    )
    if (eventIndex >= 0) {
      element.removeEventListener(type, this.eventListeners[eventIndex].event)
      this.eventListeners.splice(eventIndex, 1)
    }
  }

  private mountModal = () => {
    this.modalElement = document.createElement("div")
    document.body.appendChild(this.modalElement)
  }

  private mountBackdrop = () => {
    if (!this.backdropOpen) {
      this.backdropElement = document.createElement("div")
      document.body.appendChild(this.backdropElement)

      this.registerEventListener("click", this.backdropElement, () => {
        this.closeModal()
      })
    }
  }

  private unMountModal = () => {
    this.modalOpen = false
    this.modalElement!.remove()
  }

  private unMountBackdrop = () => {
    this.backdropOpen = false

    if (this.backdropElement) {
      this.unregisterEventListener("click", this.backdropElement)
      this.backdropElement.remove()
    }
  }

  private renderModal = (modal: ReactElement) => {
    if (this.store && this.defaultLocale) {
      ReactDOM.render(
        <Provider store={this.store}>
          <IntlProvider
            defaultLocale={this.defaultLocale}
            locale={this.defaultLocale}
            messages={localeEn}
          >
            <Router history={history}>
              <ModalWrapper>{modal}</ModalWrapper>
            </Router>
          </IntlProvider>
        </Provider>,
        this.modalElement
      )
      this.modalOpen = true
    }
  }

  private renderBackdrop = () => {
    ReactDOM.render(<ModalBackdrop />, this.backdropElement)
    this.backdropOpen = true
  }
}

const modalService = new ModalService()

export default modalService
