/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React, { ComponentType } from "react"
import { useSelector } from "react-redux"
import { ReduxRootState } from "Core/__deprecated__/renderer/store"
import { RecursiveComponent } from "../models/api-fc.types"

export const withData = <P extends object>(
  Component: ComponentType<P & { viewKey: string; componentKey: string }>
): RecursiveComponent => {
  return ({ viewKey, componentKey, ...props }) => {
    const data = useSelector(
      (state: ReduxRootState) =>
        state.genericViews.views?.[viewKey]?.data?.[componentKey]
    )
    return (
      <Component
        {...(props as P)}
        data={data}
        componentKey={componentKey}
        viewKey={viewKey}
      />
    )
  }
}
