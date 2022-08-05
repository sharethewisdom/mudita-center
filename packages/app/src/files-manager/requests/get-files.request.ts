/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { ipcRenderer } from "electron-better-ipc"
import { ResultObject } from "App/core/builder"
import {
  IpcFilesManagerRequest,
  DeviceDirectory,
} from "App/files-manager/constants"
import { File } from "App/files-manager/dto"

export const getFilesRequest = async (
  directory: DeviceDirectory
): Promise<ResultObject<File[] | undefined>> => {
  return ipcRenderer.callMain(IpcFilesManagerRequest.GetFiles, directory)
}
