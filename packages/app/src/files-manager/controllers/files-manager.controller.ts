/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { Controller, IpcEvent } from "App/core/decorators"
import { ResultObject } from "App/core/builder"
import {
  ControllerPrefix,
  IpcFilesManagerEvent,
} from "App/files-manager/constants"
import { File } from "App/files-manager/dto"
import { FileManagerService } from "App/files-manager/services"

@Controller(ControllerPrefix)
export class FilesManagerController {
  constructor(private fileManagerService: FileManagerService) {}

  @IpcEvent(IpcFilesManagerEvent.GetFiles)
  public async getFiles(): Promise<ResultObject<File[] | undefined>> {
    return this.fileManagerService.getDeviceFiles()
  }
}