/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { Endpoint, Method } from "@mudita/pure"
import { AppError } from "App/core/errors"
import { Result, ResultObject } from "App/core/builder"
import { RequestResponseStatus } from "App/core/types/request-response.interface"
import DeviceService from "App/__deprecated__/backend/device-service"
import { File } from "App/files-manager/dto"
import { DeviceDirectory } from "App/files-manager/constants"
import { FileObjectPresenter } from "App/files-manager/presenters"
import { FilesManagerError } from "App/files-manager/constants"

export class FileManagerService {
  constructor(private deviceService: DeviceService) {}

  public async getDeviceFiles(): Promise<ResultObject<File[] | undefined>> {
    const { data, status, error } = await this.deviceService.request({
      endpoint: Endpoint.FileSystem,
      method: Method.Get,
      body: {
        listDir: DeviceDirectory.Music,
      },
    })

    if (status !== RequestResponseStatus.Ok || !data) {
      return Result.failed(
        new AppError(
          FilesManagerError.GetFiles,
          error ? error.message : "Something wen't wrong"
        )
      )
    }

    return Result.success(
      data[DeviceDirectory.Music].map(FileObjectPresenter.toFile)
    )
  }
}