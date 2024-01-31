/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React, { UIEventHandler, useState } from "react"
import ReactModal from "react-modal"
import { BaseGenericComponent, IconType, ModalAction } from "generic-view/utils"
import { ModalLayers } from "Core/modals-manager/constants/modal-layers.enum"
import styled, { css } from "styled-components"
import Icon from "../../icon/icon"
import { ButtonBase } from "../../buttons/button-base/button-base"
import { useModalsQueue } from "./use-modals-queue"
import { withData } from "../../utils/with-data"
import { withConfig } from "../../utils/with-config"

interface Config {
  closeButtonAction?: ModalAction
  width?: string | number
}

export const Modal: BaseGenericComponent<
  undefined,
  Config,
  { componentKey: string }
> = ({ children, componentKey, config }) => {
  const [contentScrolled, setContentScrolled] = useState(false)
  const { opened } = useModalsQueue(componentKey)

  const closeAction: ModalAction = config?.closeButtonAction
    ? config.closeButtonAction
    : { type: "close-modal", modalKey: componentKey }

  const handleScroll: UIEventHandler<HTMLDivElement> = (event) => {
    const target = event.target as HTMLDivElement
    setContentScrolled(target.scrollTop > 0)
  }

  return (
    <ReactModal
      className="generic-modal"
      overlayClassName="generic-modal-overlay"
      isOpen={opened}
      style={{
        overlay: {
          zIndex: ModalLayers.Default,
        },
        content: {
          width: config?.width || 678,
          zIndex: ModalLayers.Default,
        },
      }}
      closeTimeoutMS={400}
    >
      <ModalHeader $active={contentScrolled}>
        <ModalClose action={closeAction} test-id={"close-button"}>
          <CloseIcon data={{ type: IconType.Close }} />
        </ModalClose>
      </ModalHeader>
      <ScrollContainer onScroll={handleScroll}>{children}</ScrollContainer>
    </ReactModal>
  )
}

export default withConfig(withData(Modal))

const headerWhileScrollingStyles = css`
  box-shadow: 0 1rem 5rem 0 rgba(0, 0, 0, 0.08);
`

const ModalHeader = styled.header<{ $active: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.space.xl};
  transition: box-shadow 0.3s ease-in-out;
  background-color: ${({ theme }) => theme.color.white};
  ${({ $active }) => $active && headerWhileScrollingStyles};
`

const ModalClose = styled(ButtonBase)`
  width: 3.2rem;
  height: 3.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CloseIcon = styled(Icon)`
  cursor: pointer;
  width: 1.6rem;
  height: 1.6rem;
`

const ScrollContainer = styled.div`
  overflow-y: auto;
  padding: 0 3.7rem 0 4rem;
  margin-right: 0.3rem;
  margin-bottom: 4rem;
  flex: 1;
`
