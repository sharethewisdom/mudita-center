/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React, { ComponentProps } from "react"
import { Provider } from "react-redux"
import { renderWithThemeAndIntl } from "Core/__deprecated__/renderer/utils/render-with-theme-and-intl"
import TetheringUI from "Core/__deprecated__/renderer/modules/tethering/tethering-ui.component"
import { TetheringTestIds } from "Core/__deprecated__/renderer/modules/tethering/screens/tethering.enum"
import { SettingsTogglerTestIds } from "Core/settings/components/settings-toggler/settings-toggler-test-ids.enum"
import store from "Core/__deprecated__/renderer/store"

jest.mock("@electron/remote", () => ({
  dialog: {
    showOpenDialog: jest.fn(),
  },
}))

const renderer = (props = {}) =>
  renderWithThemeAndIntl(
    <Provider store={store}>
      <TetheringUI {...props} />
    </Provider>
  )

describe("Pure disconnected screen tests", () => {
  const props: ComponentProps<typeof TetheringUI> = { deviceUnlocked: false }
  test("disabled screen is shown", () => {
    const { getByTestId, queryByTestId } = renderer(props)
    expect(getByTestId(TetheringTestIds.DisconnectedWrapper)).toBeVisible()
    expect(
      queryByTestId(TetheringTestIds.EnabledWrapper)
    ).not.toBeInTheDocument()
  })

  test("header is visible", () => {
    const { getByTestId } = renderer(props)
    expect(
      getByTestId(TetheringTestIds.DisconnectedNotificationTitle)
    ).toBeVisible()
  })

  test("Start tethering notification is visible", () => {
    const { getByTestId } = renderer(props)
    expect(
      getByTestId(TetheringTestIds.StartTetheringNotification)
    ).toBeVisible()
  })

  test("modem notification is visible", () => {
    const { getByTestId } = renderer(props)
    expect(getByTestId(TetheringTestIds.ModemNotification)).toBeVisible()
  })

  test("button redirecting to settings is visible", () => {
    const { getByTestId } = renderer(props)
    expect(getByTestId(TetheringTestIds.GoToButton)).toBeVisible()
  })

  test("disconnected image is visible", () => {
    const { getByTestId } = renderer(props)
    expect(getByTestId(TetheringTestIds.DisconnectedImage)).toBeVisible()
  })
})

describe("Enabled tethering tests", () => {
  const props: ComponentProps<typeof TetheringUI> = {
    tetheringEnabled: true,
    deviceUnlocked: true,
  }
  test("enabled screen is shown", () => {
    const { getByTestId, queryByTestId } = renderer(props)
    expect(getByTestId(TetheringTestIds.EnabledWrapper)).toBeVisible()
    expect(
      queryByTestId(TetheringTestIds.DisconnectedWrapper)
    ).not.toBeInTheDocument()
  })

  test("Start tethering notification is visible", () => {
    const { getByTestId } = renderer(props)
    expect(
      getByTestId(TetheringTestIds.StartTetheringNotification)
    ).toBeVisible()
  })

  test("button redirecting to settings is visible", () => {
    const { getByTestId } = renderer(props)
    expect(getByTestId(TetheringTestIds.GoToButton)).toBeVisible()
  })
})

describe("Disabled tethering tests", () => {
  const props: ComponentProps<typeof TetheringUI> = {
    tetheringEnabled: false,
    deviceUnlocked: true,
  }
  test("disabled screen is shown", () => {
    const { getByTestId, queryByTestId } = renderer(props)
    expect(getByTestId(TetheringTestIds.DisabledWrapper)).toBeVisible()
    expect(
      queryByTestId(TetheringTestIds.DisconnectedWrapper)
    ).not.toBeInTheDocument()
  })

  test("Start tethering notification is visible", () => {
    const { getByTestId } = renderer(props)
    expect(
      getByTestId(TetheringTestIds.StartTetheringNotification)
    ).toBeVisible()
  })

  test("Modem notification is visible", () => {
    const { getByTestId } = renderer(props)
    expect(getByTestId(TetheringTestIds.ModemNotification)).toBeVisible()
  })

  test("button redirecting to settings is visible", () => {
    const { getByTestId } = renderer(props)
    expect(getByTestId(TetheringTestIds.GoToButton)).toBeVisible()
  })

  test("image is visible", () => {
    const { getByTestId } = renderer(props)
    expect(getByTestId(TetheringTestIds.DisabledImage)).toBeVisible()
  })

  test("toggler works correctly", () => {
    const onToggleTethering = jest.fn()
    const { getByTestId } = renderer({ onToggleTethering, ...props })
    getByTestId(SettingsTogglerTestIds.Inactive).click()
    expect(onToggleTethering).toBeCalledWith(true)
  })
})