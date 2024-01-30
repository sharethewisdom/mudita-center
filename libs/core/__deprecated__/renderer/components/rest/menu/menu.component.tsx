/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { createSelector } from "@reduxjs/toolkit"
import { DeviceType } from "Core/device/constants"
import { ReduxRootState } from "Core/__deprecated__/renderer/store"
import { DevMode } from "Core/__deprecated__/dev-mode/store/dev-mode.interface"
import { FunctionComponent } from "Core/core/types/function-component.interface"
import { View } from "Core/__deprecated__/renderer/constants/views"
import { getUnreadThreads } from "Core/messages/selectors"
import MenuTop from "Core/__deprecated__/renderer/components/rest/menu/menu-top.component"
import MenuBottom from "Core/__deprecated__/renderer/components/rest/menu/menu-bottom.component"
import { MenuElement } from "Core/__deprecated__/renderer/constants/menu-elements"
import { getActiveDeviceTypeSelector } from "Core/device-manager/selectors/get-active-device-type.selector"
import { RootModel } from "Core/__deprecated__/renderer/models/models"
import { deviceStateSelector } from "Core/device/selectors"
import { activeDeviceMenuElements } from "generic-view/store"

const MenuContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0 3.2rem;
  justify-content: space-between;
  min-height: 100%;
`

export interface MenuProps {
  deviceType: DeviceType | null
  deviceFeaturesVisible?: boolean
  openHelpWindow?: () => void
  devModeEnabled?: DevMode["enabled"]
  notifications: {
    [View.Messages]: boolean
  }
  dataSyncInProgress?: boolean
  genericMenuElements?: MenuElement[]
}

const Menu: FunctionComponent<MenuProps> = ({
  dataSyncInProgress,
  ...rest
}) => {
  return (
    <MenuContainer>
      <MenuTop {...rest} />
      <MenuBottom dataSyncInProgress={dataSyncInProgress} />
    </MenuContainer>
  )
}

// TODO: change type for `deviceType` in Menu
const getActiveDeviceTypeSelectorWrapper = createSelector(
  getActiveDeviceTypeSelector,
  deviceStateSelector,
  (deviceType, deviceState): DeviceType | null => {
    return deviceType ?? deviceState.deviceType ?? null
  }
)

const mapDispatchToProps = (state: RootModel & ReduxRootState) => ({
  deviceType: getActiveDeviceTypeSelectorWrapper(state),
  notifications: {
    [View.Messages]: getUnreadThreads(state).length > 0,
  },
  genericMenuElements: activeDeviceMenuElements(state),
})

export default connect(mapDispatchToProps)(Menu)