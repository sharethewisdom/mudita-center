/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { Slicer } from "@rematch/select"
import { FilesManagerState } from "App/__deprecated__/renderer/models/files-manager/files-manager.interface"
import { createModel } from "@rematch/core"
import { RootModel } from "App/__deprecated__/renderer/models/models"

export const initialState: FilesManagerState = {
  memoryData: [],
}

const filesManager = createModel<RootModel>({
  state: initialState,
  selectors: (slice: Slicer<typeof initialState>) => ({
    memoryChartData() {
      return slice((state) => {
        // AUTO DISABLED - fix me if you like :)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return state.memoryData
      })
    },
  }),
})

export default filesManager
