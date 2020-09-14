import React from "react"
import { FunctionComponent } from "Renderer/types/function-component.interface"
import { ModalSize } from "Renderer/components/core/modal/modal.interface"
import { intl } from "Renderer/utils/intl"
import {
  ButtonsContainer,
  ButtonWrapper,
  ModalText,
  SyncButton,
} from "Renderer/components/rest/sync-modals/sync-contacts.styled"
import Text, {
  TextDisplayStyle,
} from "Renderer/components/core/text/text.component"
import { DisplayStyle } from "Renderer/components/core/button/button.config"
import { Type } from "Renderer/components/core/icon/icon.config"
import { noop } from "Renderer/utils/noop"
import { RoundIconWrapper } from "Renderer/modules/overview/overview.modals"
import Icon from "Renderer/components/core/icon/icon.component"
import { LoaderType } from "Renderer/components/core/loader/loader.interface"
import Loader from "Renderer/components/core/loader/loader.component"
import Modal, {
  ModalProps,
} from "Renderer/components/core/modal/modal.component"
import { ModalContent } from "App/renderer/modules/overview/backup-process/modals.styled"

interface SyncCalendarModalProps {
  onClose?: () => void
  onGoogleButtonClick?: () => void
}

const SyncModal: FunctionComponent<Partial<ModalProps>> = ({
  children,
  size = ModalSize.Small,
  ...props
}) => (
  <Modal size={size} {...props}>
    <ModalContent>{children}</ModalContent>
  </Modal>
)

export const SyncCalendarModal: FunctionComponent<SyncCalendarModalProps> = ({
  onClose = noop,
  onGoogleButtonClick = noop,
}) => (
  <SyncModal
    size={ModalSize.Small}
    title={intl.formatMessage({
      id: "view.name.calendar.syncModal.title",
    })}
    closeButton={false}
    onClose={onClose}
  >
    <RoundIconWrapper>
      <Icon type={Type.Download} width={4} />
    </RoundIconWrapper>
    <Text
      displayStyle={TextDisplayStyle.LargeBoldText}
      message={{
        id: "view.name.calendar.syncModal.subtitle",
      }}
    />
    <ModalText
      displayStyle={TextDisplayStyle.MediumFadedText}
      message={{
        id: "view.name.calendar.syncModal.body",
      }}
    />
    <ButtonsContainer>
      <ButtonWrapper>
        <SyncButton
          displayStyle={DisplayStyle.Primary}
          label={intl.formatMessage({
            id: "view.name.phone.contacts.googleButtonText",
          })}
          Icon={Type.Google}
          onClick={onGoogleButtonClick}
        />
      </ButtonWrapper>
    </ButtonsContainer>
  </SyncModal>
)

export const SynchronizingModal: FunctionComponent<SyncCalendarModalProps> = ({
  onClose = noop,
}) => (
  <SyncModal size={ModalSize.Small} onClose={onClose}>
    <RoundIconWrapper>
      <Loader type={LoaderType.Spinner} />
    </RoundIconWrapper>
    <Text
      displayStyle={TextDisplayStyle.LargeBoldText}
      message={{
        id: "view.name.calendar.synchronizingModal.bodyHeader",
      }}
    />
    <ModalText
      displayStyle={TextDisplayStyle.MediumFadedText}
      message={{
        id: "view.name.calendar.synchronizingModal.body",
      }}
    />
  </SyncModal>
)
