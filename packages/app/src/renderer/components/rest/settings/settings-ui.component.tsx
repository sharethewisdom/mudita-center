/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { AppSettings } from "App/main/store/settings.interface"
import React from "react"
import { FunctionComponent } from "Renderer/types/function-component.interface"
import {
  ActionsWrapper,
  Name,
  TableRow,
} from "Renderer/components/rest/messages/threads-table.component"
import Text, {
  TextDisplayStyle,
} from "Renderer/components/core/text/text.component"
import { noop } from "Renderer/utils/noop"
import styled from "styled-components"
import { FormattedMessage } from "react-intl"
import { borderColor } from "Renderer/styles/theming/theme-getters"
import SettingsToggler from "Renderer/components/rest/settings/settings-toggler.component"
import { SettingsTestIds } from "Renderer/modules/settings/settings.enum"
import Tooltip from "Renderer/components/core/tooltip/tooltip.component"
import { defineMessages } from "react-intl"
import { Type } from "Renderer/components/core/icon/icon.config"

export const SettingsTableRow = styled(TableRow)`
  grid-template-areas: "Checkbox Actions";
  grid-template-columns: 1fr 15rem;
  border-bottom: solid 0.1rem ${borderColor("list")};
  height: 7.2rem;
  max-height: 7.2rem;
  &:hover {
    background-color: transparent;
  }
`

export const Data = styled.div`
  grid-area: Checkbox;
  align-self: center;
  display: flex;
  flex-direction: row;
`

export const SettingsLabel = styled(Name)`
  margin-left: 4rem;
  margin-bottom: 0;
  align-self: center;
`

export const SettingsDescriptionWrapper = styled.div`
  border-bottom: solid 0.1rem ${borderColor("list")};
`

export const SettingsDescription = styled(Text)`
  margin-left: 4rem;
  margin-bottom: 3.2rem;
`

export const SettingsTooltip = styled(Tooltip)`
  margin-left: 0.4rem;
`

export const SettingsWrapper = styled.section``

interface Properties {
  appAutostart: boolean
  appTethering: boolean
  appCollectingData: boolean
  setTethering?: (option: AppSettings["appTethering"]) => void
  setCollectingData?: (option: AppSettings["appCollectingData"]) => void
}

const messages = defineMessages({
  tooltipDescription: { id: "module.settings.collectingDataTooltip" },
})

const SettingsUI: FunctionComponent<Properties> = ({
  appTethering,
  setTethering = noop,
  appCollectingData,
  setCollectingData = noop,
}) => {
  return (
    <SettingsWrapper data-testid={SettingsTestIds.Wrapper}>
      {/*TODO: Remove condition below when tethering will be available on phone*/}
      {process.env.NODE_ENV === "development" && (
        <SettingsTableRow
          checkMode={false}
          data-testid={SettingsTestIds.TableRow}
        >
          <Data>
            <SettingsLabel displayStyle={TextDisplayStyle.LargeText}>
              <FormattedMessage id="module.settings.tetheringLabel" />
            </SettingsLabel>
          </Data>
          <ActionsWrapper>
            <SettingsToggler
              toggleValue={appTethering}
              onToggle={setTethering}
            />
          </ActionsWrapper>
        </SettingsTableRow>
      )}
      <SettingsTableRow
        checkMode={false}
        data-testid={SettingsTestIds.TableRow}
      >
        <Data>
          <SettingsLabel displayStyle={TextDisplayStyle.LargeText}>
            <FormattedMessage id="module.settings.collectingData" />
          </SettingsLabel>
          <SettingsTooltip
            tooltipDescription={messages.tooltipDescription}
            tooltipIconType={Type.MenuHelp}
            iconSize={2.2}
          />
        </Data>
        <ActionsWrapper>
          <SettingsToggler
            toggleValue={appCollectingData}
            onToggle={setCollectingData}
          />
        </ActionsWrapper>
      </SettingsTableRow>
    </SettingsWrapper>
  )
}

export default SettingsUI
