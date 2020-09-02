import React from "react"
import Modal from "Renderer/components/core/modal/modal.component"
import { ModalSize } from "Renderer/components/core/modal/modal.interface"
import { FunctionComponent } from "Renderer/types/function-component.interface"
import { noop } from "Renderer/utils/noop"
import { intl } from "Renderer/utils/intl"
import Text, {
  TextDisplayStyle,
} from "Renderer/components/core/text/text.component"
import styled from "styled-components"
import { Type } from "Renderer/components/core/icon/icon.config"
import Button from "Renderer/components/core/button/button.component"
import { DisplayStyle } from "Renderer/components/core/button/button.config"

interface SyncContactsModal {
  onClose?: () => void
  onGoogleButtonClick?: () => void
  onAppleButtonClick?: () => void
}

const ModalText = styled(Text)`
  text-align: center;
  margin-top: 1.2rem;
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 4.8rem;
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  button:first-child {
    margin-bottom: 1.6rem;
  }
`

const SyncButton = styled(Button)`
  width: 24.4rem;
`

const SyncContactsModal: FunctionComponent<SyncContactsModal> = ({
  onClose = noop,
  onAppleButtonClick = noop,
  onGoogleButtonClick = noop,
}) => (
  <Modal
    size={ModalSize.Small}
    title={intl.formatMessage({
      id: "view.name.phone.contacts.syncModalTitle",
    })}
    closeButton={false}
    onClose={onClose}
  >
    <ModalText
      displayStyle={TextDisplayStyle.MediumLightText}
      message={{
        id: "view.name.phone.contacts.syncModalText",
      }}
    />
    <ButtonsContainer>
      <ButtonWrapper>
        <SyncButton
          displayStyle={DisplayStyle.Primary}
          data-testid={"modal-action-button"}
          label={intl.formatMessage({
            id: "view.name.phone.contacts.googleButtonText",
          })}
          Icon={Type.Google}
          onClick={onGoogleButtonClick}
        />
        <SyncButton
          displayStyle={DisplayStyle.Primary}
          data-testid={"modal-action-button"}
          label={intl.formatMessage({
            id: "view.name.phone.contacts.appleButtonText",
          })}
          Icon={Type.Apple}
          onClick={onAppleButtonClick}
        />
      </ButtonWrapper>
    </ButtonsContainer>
  </Modal>
)

export default SyncContactsModal
