/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { ipcRenderer } from "electron-better-ipc"
import store from "Renderer/store"
import { readAllIndexes } from "App/data-sync/actions/read-all-indexes.action"
import {
  setCacheState,
  setDataSyncInitialized,
} from "App/data-sync/actions/base-app.action"
import { IpcEvent } from "App/data-sync/constants"

export const registerCacheDataListener = () => {
  ipcRenderer.on(IpcEvent.DataRestored, () => {
    store.dispatch(setCacheState())
    store.dispatch(readAllIndexes())
    store.dispatch(setDataSyncInitialized())
  })
}
