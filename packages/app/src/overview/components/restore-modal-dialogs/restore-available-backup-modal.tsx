/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React, { ComponentProps } from "react"
import { defineMessages } from "react-intl"
import styled from "styled-components"
import moment from "moment"
import { FunctionComponent } from "App/__deprecated__/renderer/types/function-component.interface"
import { RoundIconWrapper } from "App/__deprecated__/renderer/components/core/modal-shared/modal-shared"
import Icon, {
  IconSize,
} from "App/__deprecated__/renderer/components/core/icon/icon.component"
import { ModalText } from "App/contacts/components/sync-contacts-modal/sync-contacts.styled"
import Text, {
  TextDisplayStyle,
} from "App/__deprecated__/renderer/components/core/text/text.component"
import { ModalDialog } from "App/ui/components/modal-dialog"
import { Backup } from "App/backup/dto"
import { ModalSize } from "App/__deprecated__/renderer/components/core/modal/modal.interface"
import { intl } from "App/__deprecated__/renderer/utils/intl"
import { Row } from "App/__deprecated__/renderer/components/core/table/table.component"
import { DisplayStyle } from "App/__deprecated__/renderer/components/core/button/button.config"
import Button from "App/__deprecated__/renderer/components/core/button/button.component"
import { RestoreAvailableBackupModalTestIds } from "App/overview/components/restore-modal-dialogs/restore-available-backup-modal-test-ids.component"
import { sortBackups } from "App/backup/helpers/sort-backups"
import { IconType } from "App/__deprecated__/renderer/components/core/icon/icon-type"

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  p:first-of-type {
    margin-top: 0;
    margin-bottom: 2rem;
  }
`

const ModalTable = styled.div`
  --horizontal-padding: 2.4rem;
  --button-width: 3.6rem;

  ${Row} {
    padding-left: var(--horizontal-padding);
    padding-right: var(--horizontal-padding);
  }
`

const RowHeader = styled(Row)`
  text-transform: uppercase;
  &:hover {
    background-color: transparent;
  }
`

const ModalTableBody = styled.div`
  height: 40rem;
  overflow: auto;

  ${Row} {
    cursor: pointer;
    position: relative;
    padding-right: calc(var(--horizontal-padding) + var(--button-width));

    button {
      position: absolute;
      right: var(--horizontal-padding);
      transform: rotate(270deg);
    }
    button:hover {
      background-color: transparent;
    }
  }
`

const messages = defineMessages({
  restoreModalHeaderTitle: {
    id: "module.overview.restoreModalHeaderTitle",
  },
  restoreAvailableBackupModalTitle: {
    id: "module.overview.restoreAvailableBackupModalTitle",
  },
})

interface Props extends ComponentProps<typeof ModalDialog> {
  backups: Backup[]
  onBackupRowClick: (backup: Backup) => void
}

const RestoreAvailableBackupModal: FunctionComponent<Props> = ({
  backups,
  onBackupRowClick,
  ...props
}) => {
  return (
    <ModalDialog
      size={ModalSize.Medium}
      title={intl.formatMessage(messages.restoreModalHeaderTitle)}
      closeButton={false}
      {...props}
    >
      <ModalContent>
        <RoundIconWrapper>
          <Icon type={IconType.BackupFolder} width={3.2} />
        </RoundIconWrapper>
        <ModalText
          displayStyle={TextDisplayStyle.Headline4}
          message={messages.restoreAvailableBackupModalTitle}
        />
      </ModalContent>
      <ModalTable>
        <RowHeader>
          <Text displayStyle={TextDisplayStyle.Title} color="disabled">
            Backups
          </Text>
        </RowHeader>
        <ModalTableBody>
          {sortBackups(backups).map((backup) => {
            const handleOnClick = () => {
              onBackupRowClick(backup)
            }
            return (
              <Row
                onClick={handleOnClick}
                key={backup.filePath}
                data-testid={
                  RestoreAvailableBackupModalTestIds.RestoreAvailableBackupModalBodyRow
                }
              >
                <Text displayStyle={TextDisplayStyle.Paragraph3}>
                  {moment(backup.date).format("dddd, MMMM D, h:mm a")}
                </Text>
                <Button
                  Icon={IconType.ArrowDown}
                  displayStyle={DisplayStyle.IconOnly}
                  iconSize={IconSize.Small}
                />
              </Row>
            )
          })}
        </ModalTableBody>
      </ModalTable>
    </ModalDialog>
  )
}

export default RestoreAvailableBackupModal
