/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { AnyAction } from "@reduxjs/toolkit"
import thunk from "redux-thunk"
import createMockStore from "redux-mock-store"
import { SettingsState } from "Core/settings/reducers"
import { ConversionFormat, Convert } from "Core/settings/constants"
import { setSettings } from "./set-settings.action"

const settings: SettingsState = {
  applicationId: "app-Nr8uiSV7KmWxX3WOFqZPF7uB",
  autostart: false,
  tethering: false,
  incomingCalls: false,
  incomingMessages: false,
  lowBattery: false,
  osUpdates: false,
  nonStandardAudioFilesConversion: false,
  convert: Convert.ConvertAutomatically,
  conversionFormat: ConversionFormat.WAV,
  tray: true,
  osBackupLocation: `fake/path/pure/phone/backups/`,
  osDownloadLocation: `fake/path/pure/os/downloads/`,
  language: "en-US",
  neverConnected: true,
  collectingData: false,
  privacyPolicyAccepted: false,
  diagnosticSentTimestamp: 0,
  ignoredCrashDumps: [],
  updateRequired: false,
  currentVersion: "1.4.1",
  lowestSupportedVersions: {
    lowestSupportedCenterVersion: "1.0.0",
    lowestSupportedProductVersion: {
      MuditaHarmony: "1.5.0",
      MuditaPure: "1.0.0",
      APIDevice: "2.0.0",
    },
  },
  checkingForUpdate: false,
  checkingForUpdateFailed: false,
  loaded: false,
  loading: false,
  updateAvailable: undefined,
  latestVersion: undefined,
  updateAvailableSkipped: undefined
}

const mockStore = createMockStore([thunk])()

afterEach(() => {
  jest.clearAllMocks()
})

test("calls `setSettings` with `Settings` object", () => {
  mockStore.dispatch(setSettings(settings) as unknown as AnyAction)

  expect(mockStore.getActions()).toEqual([setSettings(settings)])
})
