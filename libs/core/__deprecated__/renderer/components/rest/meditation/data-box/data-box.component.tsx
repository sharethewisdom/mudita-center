/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React from "react"
import { FunctionComponent } from "Core/core/types/function-component.interface"
import {
  DataWrapper,
  TextBox,
} from "Core/__deprecated__/renderer/components/rest/meditation/data-box/data-box.styled"

const DataBox: FunctionComponent = ({ children }) => (
  <DataWrapper>
    <TextBox>{children}</TextBox>
  </DataWrapper>
)

export default DataBox
