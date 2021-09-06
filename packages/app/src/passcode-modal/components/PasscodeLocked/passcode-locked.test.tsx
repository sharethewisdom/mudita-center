/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React, { ComponentProps } from "react"
import { renderWithThemeAndIntl } from "Renderer/utils/render-with-theme-and-intl"
import PasscodeLocked from "App/passcode-modal/components/PasscodeLocked/passcode-locked.component"
import { PasscodeLockedTestIds } from "App/passcode-modal/components/PasscodeLocked/passcode-locked-test-ids.enum"
import { act } from "@testing-library/react"

type Props = ComponentProps<typeof PasscodeLocked>

const defaultProps: Props = {
  time: 1630703219,
}

const renderer = (extraProps?: Partial<Props>) => {
  const props = {
    ...defaultProps,
    ...extraProps,
  }

  return renderWithThemeAndIntl(<PasscodeLocked {...props} />)
}

describe("Time lock info", () => {
  test("should show properly days", () => {
    const { getByTestId } = renderer({ time: 172800 })
    expect(getByTestId(PasscodeLockedTestIds.Timer)).toHaveTextContent(
      `[value] component.passcodeModalTryAgain in 2 days.`
    )
  })
  test("should show properly hours", () => {
    const { getByTestId } = renderer({ time: 4000 })
    expect(getByTestId(PasscodeLockedTestIds.Timer)).toHaveTextContent(
      `[value] component.passcodeModalTryAgain in an hour.`
    )
  })
  test("should show properly minutes", () => {
    const { getByTestId } = renderer()
    expect(getByTestId(PasscodeLockedTestIds.Timer)).toHaveTextContent(
      `[value] component.passcodeModalTryAgain in 5 minutes.`
    )
  })
  test("should show properly seconds", () => {
    const { getByTestId } = renderer({ time: 30 })
    expect(getByTestId(PasscodeLockedTestIds.Timer)).toHaveTextContent(
      `[value] component.passcodeModalTryAgain in a few seconds.`
    )
  })
  test("should change value in time", () => {
    jest.useFakeTimers()
    const TIMER_DELAY = 250000
    const { getByTestId } = renderer()
    expect(getByTestId(PasscodeLockedTestIds.Timer)).toHaveTextContent(
      `[value] component.passcodeModalTryAgain in 5 minutes.`
    )
    act(() => {
      jest.advanceTimersByTime(TIMER_DELAY)
    })
    expect(getByTestId(PasscodeLockedTestIds.Timer)).toHaveTextContent(
      `[value] component.passcodeModalTryAgain in a minute.`
    )
    jest.useRealTimers()
  })
})
