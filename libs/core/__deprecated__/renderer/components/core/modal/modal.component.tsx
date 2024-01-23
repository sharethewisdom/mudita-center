/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { FunctionComponent } from "Core/core/types/function-component.interface"
import * as React from "react"
import {
  DisplayStyle,
  Size,
} from "Core/__deprecated__/renderer/components/core/button/button.config"
import styled from "styled-components"
import Button, {
  ButtonComponentProps as ButtonProps,
} from "Core/__deprecated__/renderer/components/core/button/button.component"
import { noop } from "Core/__deprecated__/renderer/utils/noop"
import {
  getButtonsPosition,
  getModalButtonsSize,
  getModalSize,
  getSubtitleStyle,
  getTitleStyle,
} from "Core/__deprecated__/renderer/components/core/modal/modal.helpers"
import { useModalServiceContext } from "Core/__deprecated__/renderer/components/core/modal/modal.service"
import {
  ModalSize,
  TitleOrder,
} from "Core/__deprecated__/renderer/components/core/modal/modal.interface"
import { intl } from "Core/__deprecated__/renderer/utils/intl"
import { ModalTestIds } from "Core/__deprecated__/renderer/components/core/modal/modal-test-ids.enum"
import { backgroundColor } from "Core/core/styles/theming/theme-getters"
import { ReactNode } from "react"
import {
  Close,
  CloseButton,
  Header,
  ModalSubTitle,
  ModalTitle,
} from "Core/__deprecated__/renderer/components/core/modal/modal.styled.elements"
import { IconType } from "Core/__deprecated__/renderer/components/core/icon/icon-type"

const ModalFrame = styled.div<{ size: ModalSize }>`
  padding: 4rem 3.2rem 4.8rem 3.2rem;
  box-sizing: border-box;
  ${({ size }) => getModalSize(size)};
  background-color: ${backgroundColor("modal")};
`

export const ButtonContainer = styled.div<{ buttonsPosition: ModalSize }>`
  ${({ buttonsPosition }) => getButtonsPosition(buttonsPosition)};
  display: flex;
  box-sizing: border-box;
  padding-top: 4rem;
`

export const ButtonWrapper = styled.div`
  display: flex;
`

export interface ModalProps {
  actionButtonLabel?: ButtonProps["label"]
  actionButtonIcon?: ButtonProps["Icon"]
  actionButtonSize?: Size | undefined
  actionButtonDisabled?: boolean
  onActionButtonClick?: () => void
  closeable?: boolean
  closeButton?: boolean
  closeButtonLabel?: ButtonProps["label"]
  onClose?: () => void
  onCloseButton?: () => void
  size?: ModalSize
  subtitle?: string
  title?: string | ReactNode
  titleOrder?: TitleOrder
}

const Modal: FunctionComponent<ModalProps> = ({
  actionButtonLabel,
  actionButtonIcon,
  actionButtonDisabled,
  onActionButtonClick,
  children,
  closeable = true,
  closeButton = true,
  closeButtonLabel = intl.formatMessage({ id: "component.modalCloseButton" }),
  onClose = noop,
  onCloseButton = noop,
  size = ModalSize.Large,
  actionButtonSize = getModalButtonsSize(size),
  subtitle,
  title,
  titleOrder = TitleOrder.TitleFirst,
  ...rest
}) => {
  const modalService = useModalServiceContext()

  const closeModal = async () => {
    // AUTO DISABLED - fix me if you like :)
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await modalService.allowClosingModal()
    await modalService.closeModal()
    onClose()
  }

  const closeModalByButtonClick = () => {
    onCloseButton()
    void closeModal()
  }

  return (
    <ModalFrame size={size} {...rest}>
      <Header
        titleOrder={titleOrder}
        subtitleGap={Boolean(subtitle)}
        data-testid={ModalTestIds.Header}
      >
        <ModalTitle
          displayStyle={getTitleStyle(size)}
          subTitle={subtitle}
          element={"h2"}
          data-testid={ModalTestIds.Title}
        >
          {title}
        </ModalTitle>
        {closeable && (
          <Close
            displayStyle={DisplayStyle.IconOnly}
            onClick={closeModal}
            Icon={IconType.Close}
            data-testid={ModalTestIds.CloseButton}
          />
        )}
        <ModalSubTitle displayStyle={getSubtitleStyle(size)} element={"p"}>
          {subtitle}
        </ModalSubTitle>
      </Header>
      {children}
      {actionButtonLabel || closeButton ? (
        <ButtonContainer buttonsPosition={size}>
          <ButtonWrapper>
            {closeButton && (
              <CloseButton
                actionButton={Boolean(actionButtonLabel)}
                displayStyle={DisplayStyle.Secondary}
                size={actionButtonSize}
                label={closeButtonLabel}
                onClick={closeModalByButtonClick}
                data-testid={ModalTestIds.CloseBottomButton}
              />
            )}
            {actionButtonLabel && onActionButtonClick && (
              <Button
                displayStyle={DisplayStyle.Primary}
                size={actionButtonSize}
                label={actionButtonLabel}
                onClick={onActionButtonClick}
                data-testid={ModalTestIds.ModalActionButton}
                Icon={actionButtonIcon}
                disabled={actionButtonDisabled}
              />
            )}
          </ButtonWrapper>
        </ButtonContainer>
      ) : null}
    </ModalFrame>
  )
}

export default Modal
