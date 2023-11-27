/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { BrowserWindow, dialog, FileFilter, OpenDialogOptions } from "electron"
import { AppError } from "App/core/errors"
import { Result, ResultObject } from "App/core/builder"
import { DialogFileSystemError } from "App/file-system/constants"

export class FilesSystemDialogService {
  private lastSelectedPath: string | undefined

  constructor(private mainApplicationWindow: BrowserWindow) {}
  public async getPaths(
    filters?: FileFilter[],
    properties?: OpenDialogOptions["properties"]
  ): Promise<ResultObject<string[] | undefined>> {
    try {
      const openDialogOptions = this.getOpenDialogOptions({
        filters,
        properties,
      })
      const result = await dialog.showOpenDialog(
        this.mainApplicationWindow,
        openDialogOptions
      )
      this.lastSelectedPath = result.filePaths[0]
      return Result.success(result.filePaths)
    } catch (error) {
      return Result.failed(
        new AppError(
          DialogFileSystemError.GetPath,
          error ? (error as Error).message : "Something went wrong"
        )
      )
    }
  }

  private getOpenDialogOptions(options: OpenDialogOptions): OpenDialogOptions {
    if (this.lastSelectedPath === undefined) {
      return options
    } else {
      const defaultPath = this.lastSelectedPath
      return {
        ...options,
        defaultPath,
      }
    }
  }
}
