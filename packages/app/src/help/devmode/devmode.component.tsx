/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React from "react"

import Button from "Renderer/components/core/button/button.component"
import Text from "Renderer/components/core/text/text.component"
import {
  DisplayStyle,
  Size,
} from "Renderer/components/core/button/button.config"
import { DevModeTestIds } from "App/help/devmode/devmode.interface"

import { FunctionComponent } from "Renderer/types/function-component.interface"

interface Props {
  disable: () => void
}

const DevMode: FunctionComponent<Props> = ({ disable }) => {
  return (
    <>
      <Text
        message={{ id: "component.devModeEnabled" }}
        data-testid={DevModeTestIds.Wrapper}
      />
      <Button
        displayStyle={DisplayStyle.Secondary}
        labelMessage={{ id: "component.devModeDisableAction" }}
        size={Size.FixedSmall}
        onClick={disable}
      />
    </>
  )
}

export default DevMode