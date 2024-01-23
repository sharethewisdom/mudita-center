/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React from "react"
import { renderWithThemeAndIntl } from "Core/__deprecated__/renderer/utils/render-with-theme-and-intl"
import { Router } from "react-router"
import history from "Core/core/routes/history"
import { PrivacyPolicyUI } from "Core/settings/components/privacy-policy/privacy-policy-ui.component"
import { PrivacyPolicyComponentTestIds } from "Core/settings/components/privacy-policy/privacy-policy-ui.enum"

const renderer = () => {
  return renderWithThemeAndIntl(
    <Router history={history}>
      <PrivacyPolicyUI />
    </Router>
  )
}

test("License component renders", () => {
  const { getByTestId } = renderer()
  expect(getByTestId(PrivacyPolicyComponentTestIds.Wrapper)).toBeInTheDocument()
})

test("render title correctly", () => {
  const titleText = "Mudita Center Privacy Policy"
  const { getByTestId } = renderer()
  expect(getByTestId(PrivacyPolicyComponentTestIds.Title)).toHaveTextContent(
    titleText
  )
})
