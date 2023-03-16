/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import {
  DataSyncState,
  SynchronizationState,
  UpdateAllIndexesRejectAction,
  SetErrorStateError,
  SynchronizationProcessState,
} from "App/data-sync/reducers/data-sync.interface"
import { createReducer } from "@reduxjs/toolkit"
import { DataSyncEvent } from "App/data-sync/constants/event.enum"
import {
  fulfilledAction,
  pendingAction,
  rejectedAction,
} from "App/__deprecated__/renderer/store/helpers"

export const initialState: DataSyncState = {
  initialized: false,
  state: SynchronizationState.Empty,
  synchronizationProcess: SynchronizationProcessState.Done,
  error: null,
}
export const dataSyncReducer = createReducer<DataSyncState>(
  initialState,
  (builder) => {
    builder
      .addCase(DataSyncEvent.SetDataSyncInitState, () => {
        return initialState
      })
      .addCase(DataSyncEvent.SetDataSyncInitialized, (state) => {
        return {
          ...state,
          state: SynchronizationState.Loaded,
          initialized: true,
          error: null,
        }
      })
      .addCase(pendingAction(DataSyncEvent.UpdateAllIndexes), (state) => {
        return {
          ...state,
          state: SynchronizationState.Loading,
          synchronizationProcess: SynchronizationProcessState.InProgress,
        }
      })
      .addCase(fulfilledAction(DataSyncEvent.UpdateAllIndexes), (state) => {
        return {
          ...state,
          state: SynchronizationState.Loaded,
          synchronizationProcess: SynchronizationProcessState.Done,
          initialized: true,
          error: null,
        }
      })
      .addCase(
        rejectedAction(DataSyncEvent.UpdateAllIndexes),
        (state, action: UpdateAllIndexesRejectAction) => {
          return {
            ...state,
            state: SynchronizationState.Error,
            synchronizationProcess: SynchronizationProcessState.Done,
            error: action.payload,
          }
        }
      )
      .addCase(DataSyncEvent.SetLoadingState, (state) => {
        return {
          ...state,
          state: SynchronizationState.Loading,
          synchronizationProcess: SynchronizationProcessState.InProgress,
        }
      })
      .addCase(DataSyncEvent.SetCacheState, (state) => {
        return {
          ...state,
          state: SynchronizationState.Cache,
          initialized: true,
        }
      })
      .addCase(DataSyncEvent.SetLoadedState, (state) => {
        return {
          ...state,
          state: SynchronizationState.Loaded,
          synchronizationProcess: SynchronizationProcessState.Done,
        }
      })
      .addCase(
        DataSyncEvent.SetErrorState,
        (state, action: SetErrorStateError) => {
          return {
            ...state,
            state: SynchronizationState.Error,
            synchronizationProcess: SynchronizationProcessState.Done,
            error: action.payload,
          }
        }
      )
  }
)
