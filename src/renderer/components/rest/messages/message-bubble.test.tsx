import { renderWithThemeAndIntl } from "Renderer/utils/render-with-theme-and-intl"
import React from "react"
import MessageBubble from "Renderer/components/rest/messages/message-bubble.component"
import { fireEvent } from "@testing-library/dom"
import "@testing-library/jest-dom"

const user = { firstName: "user", lastName: "userowski" }
const singleMessage = [
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, quae",
]
const multipleMessages = [
  "1Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, quae",
  "2Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, quae",
]

test("by default dropdown is not visible", () => {
  const { getByTestId } = renderWithThemeAndIntl(
    <MessageBubble user={user} messages={singleMessage} />
  )
  expect(getByTestId("dropdown")).not.toBeVisible()
})

test("after clicking button, dropdown is displayed", () => {
  const { getByTestId } = renderWithThemeAndIntl(
    <MessageBubble user={user} messages={singleMessage} />
  )
  fireEvent.click(getByTestId("dropdown-action-button"))
  expect(getByTestId("dropdown")).toBeVisible()
})

test("single message is displayed correctly", () => {
  const { getByTestId } = renderWithThemeAndIntl(
    <MessageBubble user={user} messages={singleMessage} />
  )
  expect(getByTestId("message-content")).toHaveTextContent(singleMessage[0])
})

test("multiple messages are displayed correctly", () => {
  const { getAllByTestId } = renderWithThemeAndIntl(
    <MessageBubble user={user} messages={multipleMessages} />
  )
  const messsageBubbles = getAllByTestId("message-content")
  expect(messsageBubbles[0]).toHaveTextContent(multipleMessages[0])
  expect(messsageBubbles[1]).toHaveTextContent(multipleMessages[1])
})