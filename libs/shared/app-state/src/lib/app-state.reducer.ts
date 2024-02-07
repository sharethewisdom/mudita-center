/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { createReducer } from "@reduxjs/toolkit"
import { getPaths } from "./dialog-file-system/get-paths.action"

export interface AppState {
  dialogOpen: boolean
}

const initialState: AppState = {
  dialogOpen: false,
}

export const appStateReducer = createReducer(initialState, (builder) => {
  builder.addCase(getPaths.pending, (state) => {
    state.dialogOpen = true
  })
  builder.addCase(getPaths.fulfilled, (state) => {
    state.dialogOpen = false
  })
  builder.addCase(getPaths.rejected, (state) => {
    state.dialogOpen = false
  })
})
