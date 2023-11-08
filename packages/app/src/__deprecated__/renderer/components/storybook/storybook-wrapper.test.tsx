/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React from "react"
import { renderWithThemeAndIntl } from "App/__deprecated__/renderer/utils/render-with-theme-and-intl"
import StorybookWrapper from "App/__deprecated__/renderer/components/storybook/storybook-wrapper.component"
import Story from "App/__deprecated__/renderer/components/storybook/story.component"
import StoryContainer from "App/__deprecated__/renderer/components/storybook/story-container.component"
import { fireEvent } from "@testing-library/react"

const renderStorybookWrapper = () => {
  const children = (
    <StoryContainer key={1} title="I'm a story container">
      <Story title="I'm a story">
        {/* AUTO DISABLED - fix me if you like :) */}
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <div data-testid="component">I'm a component</div>
      </Story>
    </StoryContainer>
  )

  const outcome = renderWithThemeAndIntl(
    <StorybookWrapper>
      {React.cloneElement(children, {
        _source: { fileName: "test/src/component/test.stories.tsx" },
      })}
    </StorybookWrapper>
  )
  return {
    ...outcome,
  }
}

test("renders default story wrapper properly", () => {
  const { getByText } = renderStorybookWrapper()
  expect(getByText("I'm a component")).toBeInTheDocument()
})

test("toggles border mode properly", () => {
  const { getByTestId } = renderStorybookWrapper()
  fireEvent.click(getByTestId("toggleBorderMode"))
  expect(getByTestId("component")).toHaveStyle(
    "box-shadow: 0 0 0 0.1rem #ff0000;"
  )
  fireEvent.click(getByTestId("toggleBorderMode"))
  expect(getByTestId("component")).not.toHaveStyle(
    "box-shadow: 0 0 0 0.1rem #ff0000;"
  )
})
