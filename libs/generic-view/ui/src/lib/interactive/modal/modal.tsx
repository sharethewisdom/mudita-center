/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React from "react"
import { BaseGenericComponent } from "generic-view/utils"
import { useModalsQueue } from "./use-modals-queue"
import { ModalBase } from "./modal-base"
import { ModalButtons } from "./helpers/modal-buttons"
import { ModalCloseButton } from "./helpers/modal-close-button"
import { ModalSizeController } from "./helpers/modal-size-controller"
import { ModalTitle } from "./helpers/modal-title"
import { ModalTitleIcon } from "./helpers/modal-title-icon"
import { ModalScrollableContent } from "./helpers/modal-scrollable-content"
import { ModalContent } from "./helpers/modal-content"
import { ModalConfig } from "generic-view/models"

export const Modal: BaseGenericComponent<
  undefined,
  ModalConfig,
  { componentKey: string }
> & {
  TitleIcon: typeof ModalTitleIcon
  Title: typeof ModalTitle
  ScrollableContent: typeof ModalScrollableContent
  Buttons: typeof ModalButtons
  CloseButton: typeof ModalCloseButton
  SizeController: typeof ModalSizeController
} = ({ children, componentKey, config }) => {
  const { opened } = useModalsQueue(componentKey)

  return (
    <ModalBase
      overlayHidden={config.overlayHidden}
      opened={Boolean(opened || config.defaultOpened)}
      size={config.size}
      config={{
        width: config.width,
        maxHeight: config.maxHeight,
        padding: config.padding,
        gap: config.gap,
      }}
    >
      {config.closeButtonAction && (
        <ModalCloseButton config={{ action: config.closeButtonAction }} />
      )}
      <ModalContent>{children}</ModalContent>
    </ModalBase>
  )
}

Modal.TitleIcon = ModalTitleIcon
Modal.Title = ModalTitle
Modal.ScrollableContent = ModalScrollableContent
Modal.Buttons = ModalButtons
Modal.CloseButton = ModalCloseButton
Modal.SizeController = ModalSizeController

export default Modal
