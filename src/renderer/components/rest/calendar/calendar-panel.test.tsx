import { renderWithThemeAndIntl } from "Renderer/utils/render-with-theme-and-intl"
import { fireEvent } from "@testing-library/dom"
import React from "react"
import CalendarPanel from "Renderer/components/rest/calendar/calendar-panel.component"
import { CalendarEvent } from "Renderer/modules/calendar/calendar.interface"
import { InputSelectTestIds } from "Renderer/components/core/input-select/input-select.component"

const defaultProps = {
  onAddEventClick: jest.fn(),
  onSynchroniseClick: jest.fn(),
  onEventSelect: jest.fn(),
  events: [
    {
      id: "test-event-1",
      name: "Meeting",
      date: [new Date("2020-01-01 11:00"), new Date("2020-01-01 14:00")],
    },
    {
      id: "test-event-2",
      name: "Felix's Birthday",
      date: [new Date("2020-01-02 11:00"), new Date("2020-01-02 14:00")],
    },
  ] as CalendarEvent[],
}

const renderer = (extraProps?: {}) => {
  const props = {
    ...defaultProps,
    ...extraProps,
  }
  const outcome = renderWithThemeAndIntl(<CalendarPanel {...props} />)
  return {
    ...outcome,
    selectInput: () => outcome.getByRole("searchbox"),
    selectList: () => outcome.queryByTestId(InputSelectTestIds.List),
    selectListItems: () =>
      outcome.queryAllByTestId(InputSelectTestIds.ListItem),
  }
}

test("search input dropdown shows after writing at least 3 chars", () => {
  const { selectInput, selectList } = renderer()

  fireEvent.focus(selectInput())

  for (let i = 0; i < 4; i++) {
    const value = defaultProps.events[0].name.substr(0, i)
    fireEvent.change(selectInput(), {
      target: { value },
    })
    if (i < 3) {
      expect(selectList()).not.toBeInTheDocument()
    } else {
      expect(selectList()).toBeInTheDocument()
      expect(selectList()).toBeVisible()
    }
  }
})

test("clicking on searched option returns given item properly", () => {
  const onEventSelect = jest.fn()
  const { selectInput, selectListItems } = renderer({ onEventSelect })

  fireEvent.focus(selectInput())
  fireEvent.change(selectInput(), {
    target: { value: defaultProps.events[1].name.substr(0, 3) },
  })
  fireEvent.click(selectListItems()[0])
  expect(onEventSelect).toBeCalledWith(defaultProps.events[1])
})

test("synchronising is performed after clicking button", () => {
  const { getByText } = renderer()
  const synchroniseButton = getByText(
    "[value] view.name.calendar.panel.synchroniseButton"
  )
  synchroniseButton.click()
  expect(defaultProps.onSynchroniseClick).toBeCalled()
})

test("add event is performed after clicking button", () => {
  const { getByText } = renderer()
  const addEventButton = getByText(
    "[value] view.name.calendar.panel.addEventButton"
  )
  addEventButton.click()
  expect(defaultProps.onAddEventClick).toBeCalled()
})
