import { ChangeEvent } from "react"
import { connect } from "react-redux"
import { VisibilityFilter } from "Renderer/models/messages/messages.interface"
import { RootModel } from "Renderer/models/models"
import Messages from "./messages.component"
import { select } from "Renderer/store"

const selector = select(({ messages, phone }) => ({
  list: messages.filteredList,
  attachContactList: phone.contactList,
}))

const mapStateToProps = (state: RootModel) => ({
  ...state.messages,
  ...state.settings,
  ...selector(state, {}),
})

const mapDispatchToProps = (dispatch: any) => ({
  changeSearchValue: ({ target }: ChangeEvent<HTMLInputElement>) =>
    dispatch.messages.changeSearchValue(target.value),
  changeVisibilityFilter: (filter: VisibilityFilter) =>
    dispatch.messages.changeVisibilityFilter(filter),
  deleteConversation: (ids: string[]) =>
    dispatch.messages.deleteConversation(ids),
  markAsRead: (ids: string[]) => dispatch.messages.markAsRead(ids),
  toggleReadStatus: (ids: string[]) => dispatch.messages.toggleReadStatus(ids),
})

export default connect(mapStateToProps, mapDispatchToProps)(Messages)
