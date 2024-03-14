/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { ResultObject } from "Core/core/builder"
import { FileManagerServiceEvents } from "device/models"
import { ipcRenderer } from "electron-better-ipc"

export const saveFileRequest = (
  filePath: string,
  transferId: number
): Promise<ResultObject<undefined>> => {
  return ipcRenderer.callMain(FileManagerServiceEvents.SaveFile, {
    filePath,
    transferId,
  })
}
