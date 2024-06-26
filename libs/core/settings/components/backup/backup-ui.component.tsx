/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React from "react"
import { FunctionComponent } from "Core/core/types/function-component.interface"
import styled from "styled-components"
import { ActionsWrapper } from "Core/__deprecated__/renderer/components/rest/messages/threads-table.component"
import { borderColor } from "Core/core/styles/theming/theme-getters"
import { TextDisplayStyle } from "Core/__deprecated__/renderer/components/core/text/text.component"
import { FormattedMessage } from "react-intl"
import { intl } from "Core/__deprecated__/renderer/utils/intl"
import ButtonComponent from "Core/__deprecated__/renderer/components/core/button/button.component"
import { Settings } from "Core/settings/dto"
import {
  Data,
  SettingsLabel,
  SettingsTableRow,
} from "Core/settings/components/settings"
import ElementWithTooltip, {
  ElementWithTooltipPlace,
} from "Core/__deprecated__/renderer/components/core/tooltip/element-with-tooltip.component"
import { TextTooltip } from "Core/ui/components/text-tooltip/text-tooltip.component"
import Text from "Core/__deprecated__/renderer/components/core/text/text.component"
import { SettingsBackupTestIds } from "Core/settings/components/backup/settings-backup-test-ids.enum"

const BackupTableRow = styled(SettingsTableRow)`
  grid-template-areas: "Checkbox Actions";
  grid-template-columns: 1fr 20rem;
  border-bottom: solid 0.1rem ${borderColor("list")};
  width: 100%;
`

const BackupWrapper = styled.section`
  overflow: hidden;
  display: flex;
  flex: 1;
`

const BackupActionsWrapper = styled(ActionsWrapper)`
  width: fit-content;
`
const BackupButtonComponent = styled(ButtonComponent)`
  padding: 0;
`
const Message = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 3.2rem;
  grid-area: Message;
`

const BackupData = styled(Data)`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    "Label"
    "Message";
`
interface Props {
  backupLocation: Settings["osBackupLocation"]
  openDialog?: () => void
}

const BackupUI: FunctionComponent<Props> = ({ backupLocation, openDialog }) => (
  <BackupWrapper>
    <BackupTableRow>
      <BackupData>
        <SettingsLabel displayStyle={TextDisplayStyle.Paragraph1}>
          <FormattedMessage id="module.settings.backupLabel" />
        </SettingsLabel>
        <ElementWithTooltip
          showIfTextEllipsis
          Element={
            <Message
              displayStyle={TextDisplayStyle.Paragraph3}
              data-testid="backup-location"
              color="secondary"
            >
              {backupLocation}
            </Message>
          }
          place={ElementWithTooltipPlace.BottomRight}
        >
          <TextTooltip description={backupLocation} />
        </ElementWithTooltip>
      </BackupData>
      <BackupActionsWrapper>
        <BackupButtonComponent
          onClick={openDialog}
          label={intl.formatMessage({
            id: "module.settings.backupButtonLabel",
          })}
          data-testid={SettingsBackupTestIds.ChangeLocationButton}
        />
      </BackupActionsWrapper>
    </BackupTableRow>
  </BackupWrapper>
)

export default BackupUI
