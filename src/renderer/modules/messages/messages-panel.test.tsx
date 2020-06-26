import { renderWithThemeAndIntl } from "Renderer/utils/render-with-theme-and-intl"
import React from "react"
import MessagesPanel from "Renderer/modules/messages/messages-panel.component"
import { fireEvent } from "@testing-library/dom"

test("filter buttons are rendered when there are no selected checkboxes", () => {
  const { getByTestId } = renderWithThemeAndIntl(
    <MessagesPanel selectedItemsCount={0} searchValue={""} />
  )
  expect(getByTestId("filter-buttons")).toBeInTheDocument()
})

test("filter buttons are not rendered when there are selected checkboxes", () => {
  const { queryByTestId } = renderWithThemeAndIntl(
    <MessagesPanel selectedItemsCount={1} searchValue={""} />
  )
  expect(queryByTestId("filter-buttons")).not.toBeInTheDocument()
})

test("when there are selected checkboxes, selection manager is rendered", () => {
  const { getByTestId } = renderWithThemeAndIntl(
    <MessagesPanel selectedItemsCount={1} searchValue={""} />
  )
  expect(getByTestId("selection-manager")).toBeInTheDocument()
})

test("search works", () => {
  const changeSearchValue = jest.fn()
  const { getByRole } = renderWithThemeAndIntl(
    <MessagesPanel
      selectedItemsCount={0}
      searchValue={""}
      changeSearchValue={changeSearchValue}
    />
  )
  const searchInput = getByRole("searchbox")
  fireEvent.change(searchInput, { target: { value: "G" } })
  expect(changeSearchValue).toBeCalled()
})
