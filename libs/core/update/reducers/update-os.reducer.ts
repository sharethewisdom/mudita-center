/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { createReducer } from "@reduxjs/toolkit"
import { State } from "Core/core/constants"
import { CheckForUpdateState } from "../constants/check-for-update-state.constant"
import { AppError } from "Core/core/errors"
import {
  cancelDownload,
  checkForUpdate,
  clearStateAndData,
  closeUpdateFlow,
  downloadUpdates,
  setCheckForUpdateState,
  setStateForDownloadedRelease,
  setStateForInstalledRelease,
  closeForceUpdateFlow,
  startUpdateOs,
  forceUpdate,
  checkForForceUpdateNeed,
  setTmpMuditaHarmonyPortInfo,
} from "Core/update/actions"

import {
  CheckForUpdateMode,
  DownloadState,
  ReleaseProcessState,
  SilentCheckForUpdateState,
  UpdateError,
} from "Core/update/constants"
import { UpdateOsState } from "Core/update/reducers/update-os.interface"

export const initialState: UpdateOsState = {
  silentCheckForUpdate: SilentCheckForUpdateState.Initial,
  checkForUpdateState: CheckForUpdateState.Initial,
  updateOsState: State.Initial,
  downloadState: DownloadState.Initial,
  forceUpdateState: State.Initial,
  error: null,
  needsForceUpdate: false,
  checkedForForceUpdateNeed: false,
  data: {
    availableReleasesForUpdate: null,
    downloadedProcessedReleases: null,
    updateProcessedReleases: null,
  },
  tmpMuditaHarmonyPortInfo: undefined,
}

export const updateOsReducer = createReducer<UpdateOsState>(
  initialState,
  (builder) => {
    builder.addCase(closeForceUpdateFlow, (state) => {
      return {
        ...state,
        forceUpdateState: State.Initial,
      }
    })
    builder.addCase(setCheckForUpdateState, (state, action) => {
      return {
        ...state,
        checkForUpdateState: action.payload,
      }
    })
    builder.addCase(closeUpdateFlow, (state) => {
      const { PerformedWithFailure, Performed, Initial, Failed } =
        CheckForUpdateState
      let silentCheckForUpdate: SilentCheckForUpdateState =
        state.silentCheckForUpdate
      let checkForUpdateState: CheckForUpdateState = Initial
      if (silentCheckForUpdate === SilentCheckForUpdateState.Failed) {
        silentCheckForUpdate = SilentCheckForUpdateState.Skipped
      }
      if (
        state.checkForUpdateState !== Initial &&
        state.checkForUpdateState === Failed
      ) {
        checkForUpdateState = PerformedWithFailure
      } else if (state.checkForUpdateState !== Initial) {
        checkForUpdateState = Performed
      }
      return {
        ...state,
        error: null,
        silentCheckForUpdate,
        checkForUpdateState,
        updateOsState: State.Initial,
        downloadState: DownloadState.Initial,
      }
    })
    builder.addCase(clearStateAndData, (state) => {
      return {
        ...initialState,
        tmpMuditaHarmonyPortInfo: state.tmpMuditaHarmonyPortInfo,
      }
    })
    builder.addCase(setStateForDownloadedRelease, (state, action) => {
      const { state: newReleaseState, version } = action.payload
      const newDownloadedProcessedReleases = (
        state.data.downloadedProcessedReleases ?? []
      ).map((item) =>
        item.release.version === version
          ? {
              ...item,
              state: newReleaseState,
            }
          : item
      )

      return {
        ...state,
        data: {
          ...state.data,
          downloadedProcessedReleases: newDownloadedProcessedReleases,
        },
      }
    })
    builder.addCase(setStateForInstalledRelease, (state, action) => {
      const { state: newReleaseState, version } = action.payload
      const newUpdateProcessedReleases = (
        state.data.updateProcessedReleases ?? []
      ).map((item) =>
        item.release.version === version
          ? {
              ...item,
              state: newReleaseState,
            }
          : item
      )

      const newAvailableReleasesForUpdate = (
        state.data.availableReleasesForUpdate ?? []
      ).filter(
        (release) =>
          !(
            release.version === version &&
            newReleaseState === ReleaseProcessState.Done
          )
      )

      return {
        ...state,
        data: {
          ...state.data,
          updateProcessedReleases: newUpdateProcessedReleases,
          availableReleasesForUpdate: newAvailableReleasesForUpdate,
        },
      }
    })

    builder.addCase(checkForUpdate.pending, (state, payload) => {
      state.error = null
      state.data = {
        availableReleasesForUpdate: null,
        downloadedProcessedReleases: null,
        updateProcessedReleases: null,
      }

      const {
        meta: {
          arg: { mode },
        },
      } = payload

      if (mode === CheckForUpdateMode.SilentCheck) {
        state.silentCheckForUpdate = SilentCheckForUpdateState.Loading
        state.checkForUpdateState = CheckForUpdateState.Initial
      } else if (mode === CheckForUpdateMode.TryAgain) {
        state.silentCheckForUpdate = SilentCheckForUpdateState.Skipped
        state.checkForUpdateState = CheckForUpdateState.Loading
      } else {
        state.checkForUpdateState = CheckForUpdateState.Loading
      }
    })
    builder.addCase(checkForUpdate.fulfilled, (state, action) => {
      state.data.availableReleasesForUpdate =
        action.payload.availableReleasesForUpdate
      if (action.meta.arg.mode === CheckForUpdateMode.SilentCheck) {
        state.silentCheckForUpdate = SilentCheckForUpdateState.Loaded
      } else {
        state.checkForUpdateState = CheckForUpdateState.Loaded
      }
      if (action.payload.areAllReleasesAlreadyDownloaded) {
        state.data.downloadedProcessedReleases =
          action.payload.availableReleasesForUpdate.map((release) => ({
            release,
            state: ReleaseProcessState.Done,
          }))
      }
    })
    builder.addCase(checkForUpdate.rejected, (state, action) => {
      const error = action.payload as AppError<UpdateError>

      if (error?.type === UpdateError.NoActiveDevice) {
        return { ...initialState }
      }

      if (
        action.meta.aborted &&
        action.meta.arg.mode === CheckForUpdateMode.SilentCheck
      ) {
        return {
          ...state,
          error: null,
          silentCheckForUpdate: SilentCheckForUpdateState.Initial,
        }
      } else if (action.meta.arg.mode === CheckForUpdateMode.SilentCheck) {
        return {
          ...state,
          error: error ?? null,
          silentCheckForUpdate: SilentCheckForUpdateState.Failed,
        }
      } else {
        return {
          ...state,
          error: error ?? null,
          checkForUpdateState: CheckForUpdateState.Failed,
        }
      }
    })

    builder.addCase(downloadUpdates.pending, (state, action) => {
      state.data.downloadedProcessedReleases = action.meta.arg.releases.map(
        (release) => ({
          release,
          state: ReleaseProcessState.Initial,
        })
      )
      state.error = null
      state.checkForUpdateState = CheckForUpdateState.Initial
      state.downloadState = DownloadState.Loading
    })
    builder.addCase(downloadUpdates.fulfilled, (state) => {
      state.checkForUpdateState = CheckForUpdateState.Initial
      state.silentCheckForUpdate = SilentCheckForUpdateState.Loaded
      state.downloadState = DownloadState.Loaded
    })
    builder.addCase(downloadUpdates.rejected, (state, action) => {
      const error = action.payload as AppError<UpdateError>
      if (error?.type === UpdateError.DownloadCancelledByUser) {
        state.downloadState = DownloadState.Cancelled
      } else {
        state.downloadState = DownloadState.Failed
        state.error = error
      }
    })
    builder.addCase(cancelDownload, (state) => {
      state.downloadState = DownloadState.Cancelled
    })

    builder.addCase(startUpdateOs.pending, (state, action) => {
      state.data.updateProcessedReleases = action.meta.arg.releases.map(
        (release) => ({
          release,
          state: ReleaseProcessState.Initial,
        })
      )
      state.error = null
      state.downloadState = DownloadState.Initial
      state.updateOsState = State.Loading
      state.tmpMuditaHarmonyPortInfo = undefined
    })
    builder.addCase(startUpdateOs.fulfilled, (state) => {
      state.updateOsState = State.Loaded
      state.data = {
        ...state.data,
        availableReleasesForUpdate: [],
        downloadedProcessedReleases: [],
        updateProcessedReleases: [],
      }
      state.error = null
      state.tmpMuditaHarmonyPortInfo = undefined
    })
    builder.addCase(startUpdateOs.rejected, (state, action) => {
      state.updateOsState = State.Failed
      state.error = action.payload as AppError<UpdateError>
      state.tmpMuditaHarmonyPortInfo = undefined
    })
    builder.addCase(checkForForceUpdateNeed.fulfilled, (state, action) => {
      state.needsForceUpdate = action.payload
      state.checkedForForceUpdateNeed = true
    })

    builder.addCase(forceUpdate.pending, (state, action) => {
      state.data.updateProcessedReleases = action.meta.arg.releases.map(
        (release) => ({
          release,
          state: ReleaseProcessState.Initial,
        })
      )
      state.data.downloadedProcessedReleases = action.meta.arg.releases.map(
        (release) => ({
          release,
          state: ReleaseProcessState.Initial,
        })
      )
      state.error = null
      state.forceUpdateState = State.Loading
    })
    builder.addCase(forceUpdate.fulfilled, (state) => {
      state.forceUpdateState = State.Loaded
      state.downloadState = DownloadState.Initial
      state.updateOsState = State.Initial
      state.needsForceUpdate = false
    })
    builder.addCase(forceUpdate.rejected, (state, action) => {
      state.forceUpdateState = State.Failed
      state.error = action.payload as AppError<UpdateError>
    })
    builder.addCase(setTmpMuditaHarmonyPortInfo, (state, action) => {
      state.tmpMuditaHarmonyPortInfo = action.payload
    })
  }
)
