/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { FunctionComponent } from "Renderer/types/function-component.interface"
import Text, {
  TextDisplayStyle,
} from "Renderer/components/core/text/text.component"
import React, { ComponentProps } from "react"
import {
  FileList,
  PureBackupModal,
} from "Renderer/modules/overview/backup-process/modals.styled"
import { defineMessages } from "react-intl"
import { BackupItem } from "Renderer/modules/overview/backup-process/modals.interface"
import { noop } from "Renderer/utils/noop"
import { intl } from "Renderer/utils/intl"
import { ModalSize } from "Renderer/components/core/modal/modal.interface"
import {
  Col,
  Labels,
  Row,
} from "Renderer/components/core/table/table.component"

const messages = defineMessages({
  filename: {
    id: "component.column.filename",
  },
  size: {
    id: "component.column.size",
  },
  cancel: { id: "component.button.cancel" },
  title: {
    id: "view.name.overview.backup.restoreBackupModal.title",
  },
  body: {
    id: "view.name.overview.backup.restoreBackupModal.body",
  },
  actionButton: {
    id: "view.name.overview.backup.restoreBackupModal.restoreButton",
  },
})

interface BackupRestorationStartModalProps {
  items: BackupItem[]
  restoreBackup?: () => void
}

export const BackupRestorationStartModal: FunctionComponent<BackupRestorationStartModalProps & ComponentProps<typeof PureBackupModal>> = ({
  items,
  restoreBackup = noop,
  ...props
}) => (
  <PureBackupModal
    closeButtonLabel={intl.formatMessage(messages.cancel)}
    actionButtonLabel={intl.formatMessage(messages.actionButton)}
    onActionButtonClick={restoreBackup}
    size={ModalSize.Medium}
    {...props}
  >
    <Text
      message={messages.title}
      displayStyle={TextDisplayStyle.LargeBoldText}
    />
    <Text
      message={messages.body}
      displayStyle={TextDisplayStyle.MediumFadedLightText}
    />
    <FileList>
      <Labels>
        <Col>{intl.formatMessage(messages.filename)}</Col>
        <Col>{intl.formatMessage(messages.size)}</Col>
      </Labels>
      {items.map((item) => (
        <Row key={item.name}>
          <Col>{item.name}</Col>
          <Col>{item.size}</Col>
        </Row>
      ))}
    </FileList>
  </PureBackupModal>
)
