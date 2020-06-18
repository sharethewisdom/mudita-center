import "@testing-library/jest-dom/extend-expect"
import { fireEvent } from "@testing-library/dom"
import React from "react"
import { renderWithThemeAndIntl } from "Renderer/utils/render-with-theme-and-intl"
import Templates, {
  TemplatesProps,
} from "Renderer/modules/messages/tabs/templates.component"
import { noop } from "Renderer/utils/noop"
import { intl } from "Renderer/utils/intl"
import { messages } from "Renderer/components/rest/messages/templates/templates-panel.component"
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils"

mockAllIsIntersecting(true)

const renderTemplates = ({
  onDeleteButtonClick = noop,
  onNewButtonClick = noop,
  onSearchTermChange = noop,
}: Partial<TemplatesProps> = {}) => {
  const outcome = renderWithThemeAndIntl(
    <Templates
      onDeleteButtonClick={onDeleteButtonClick}
      onNewButtonClick={onNewButtonClick}
      onSearchTermChange={onSearchTermChange}
    />
  )
  return {
    ...outcome,
    getButtons: () => outcome.getAllByRole("button") as HTMLButtonElement[],
    getNewTemplateButton: () =>
      outcome.getByText(intl.formatMessage(messages.newButton)),
  }
}

test("renders new template button properly", () => {
  const { getNewTemplateButton } = renderTemplates()
  expect(getNewTemplateButton()).toBeInTheDocument()
})

test("renders search input properly", () => {
  const { getByPlaceholderText } = renderTemplates()
  expect(
    getByPlaceholderText(intl.formatMessage(messages.searchPlaceholder))
  ).toBeInTheDocument()
})

test("calls proper action after new template button click", () => {
  const onClick = jest.fn()
  const { getNewTemplateButton } = renderTemplates({
    onNewButtonClick: onClick,
  })
  fireEvent.click(getNewTemplateButton())
  expect(onClick).toBeCalled()
})