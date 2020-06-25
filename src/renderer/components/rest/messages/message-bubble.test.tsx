import { renderWithThemeAndIntl } from "Renderer/utils/render-with-theme-and-intl"
import React from "react"
import MessageBubble from "Renderer/components/rest/messages/message-bubble.component"
import { fireEvent } from "@testing-library/dom"
import "@testing-library/jest-dom"

const user = { firstName: "user", lastName: "userowski" }
const emptyUser = { firstName: "", lastName: "" }
const id = "123"
const message =
  "2Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, quae"

test("by default dropdown is not visible", () => {
  const { getByTestId } = renderWithThemeAndIntl(
    <MessageBubble user={user} message={message} id={id} />
  )
  expect(getByTestId("dropdown")).not.toBeVisible()
})

test("after clicking button, dropdown is displayed", () => {
  const { getByTestId } = renderWithThemeAndIntl(
    <MessageBubble user={user} message={message} id={id} />
  )
  fireEvent.click(getByTestId("dropdown-action-button"))
  expect(getByTestId("dropdown")).toBeVisible()
})

test("forwards message", () => {
  const forwardMessage = jest.fn()
  const { getByTestId } = renderWithThemeAndIntl(
    <MessageBubble
      user={user}
      message={message}
      forwardMessage={forwardMessage}
      id={id}
    />
  )
  fireEvent.click(getByTestId("forward-message"))
  expect(forwardMessage).toHaveBeenCalled()
  expect(forwardMessage).toHaveBeenCalledWith(id)
})

test("removes message", () => {
  const removeMessage = jest.fn()
  const { getByTestId } = renderWithThemeAndIntl(
    <MessageBubble
      user={user}
      message={message}
      removeMessage={removeMessage}
      id={id}
    />
  )
  fireEvent.click(getByTestId("delete-message"))
  expect(removeMessage).toHaveBeenCalledWith(id)
})

test("when author of message is unknown, displays default icon in avatar", () => {
  const { getByTestId } = renderWithThemeAndIntl(
    <MessageBubble
      user={emptyUser}
      message={message}
      id={id}
      previousAuthor={true}
    />
  )
  expect(getByTestId("icon-Contacts")).toBeInTheDocument()
})
