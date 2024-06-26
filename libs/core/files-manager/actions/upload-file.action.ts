/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { DeviceType } from "Core/device/constants"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { State } from "Core/core/constants/state.constant"
import { ReduxRootState } from "Core/__deprecated__/renderer/store"
import {
  DeviceDirectory,
  eligibleFormat,
  FilesManagerError,
  FilesManagerEvent,
} from "Core/files-manager/constants"
import { getPathsWrapper } from "Core/files-manager/actions/get-paths-wrapper"
import { uploadFilesRequest } from "Core/files-manager/requests"
import { getFiles } from "Core/files-manager/actions/get-files.action"
import {
  setDuplicatedFiles,
  setInvalidFiles,
  setUploadBlocked,
  setUploadingFileCount,
  setUploadingState,
} from "Core/files-manager/actions/base.action"
import { loadStorageInfoAction } from "Core/device/actions/load-storage-info.action"
import { getDuplicatedFiles } from "Core/files-manager/helpers/get-duplicated-files.helper"
import { AppError } from "Core/core/errors/app-error"
import { checkFilesExtensions } from "../helpers/check-files-extensions.helper"

export const uploadFile = createAsyncThunk<
  void,
  void,
  { state: ReduxRootState }
>(
  FilesManagerEvent.UploadFiles,
  async (_, { getState, dispatch, rejectWithValue }) => {
    dispatch(setUploadBlocked(true))
    const { payload: getPathsPayload } = await getPathsWrapper(dispatch, {
      filters: [
        {
          name: "Audio",
          extensions: eligibleFormat,
        },
      ],
      properties: ["openFile", "multiSelections"],
    })

    const state = getState()

    if (state.device.deviceType === null) {
      return rejectWithValue("device Type isn't set")
    }

    if (state.filesManager.files === null) {
      return rejectWithValue("files are not yet loaded")
    }

    if (!getPathsPayload.ok || !getPathsPayload.data) {
      dispatch(setUploadBlocked(false))
      return rejectWithValue("no files to upload")
    }

    const filePaths = getPathsPayload.data

    if (filePaths.length === 0) {
      dispatch(setUploadBlocked(false))
      return
    }

    const { validFiles, invalidFiles } = checkFilesExtensions(filePaths)

    if (!validFiles.length && invalidFiles.length) {
      dispatch(setUploadBlocked(false))
      return rejectWithValue(
        new AppError(
          FilesManagerError.UnsupportedFileFormat,
          "Unsupported file format"
        )
      )
    }

    const duplicatedFiles = getDuplicatedFiles(
      state.filesManager.files,
      validFiles
    )

    if (duplicatedFiles.length > 0) {
      dispatch(setDuplicatedFiles(duplicatedFiles))
      dispatch(setUploadBlocked(false))
      return rejectWithValue(
        new AppError(
          FilesManagerError.UploadDuplicates,
          "File already exists on your device"
        )
      )
    }

    dispatch(setUploadingFileCount(validFiles.length))
    dispatch(setUploadingState(State.Loading))

    const directory =
      state.device.deviceType === DeviceType.MuditaHarmony
        ? DeviceDirectory.Relaxation
        : DeviceDirectory.Music

    const result = await uploadFilesRequest({
      directory,
      filePaths: validFiles,
    })

    void dispatch(getFiles(directory))

    if (!result.ok) {
      return rejectWithValue(result.error)
    }

    void dispatch(loadStorageInfoAction())
    dispatch(setUploadingState(State.Loaded))
    dispatch(setUploadBlocked(false))
    if (invalidFiles.length) {
      dispatch(setInvalidFiles(invalidFiles))
    }

    return
  }
)
