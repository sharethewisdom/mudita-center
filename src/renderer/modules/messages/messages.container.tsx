import { ChangeEvent } from "react"
import { connect } from "react-redux"
import { VisibilityFilter } from "Renderer/models/messages/messages.interface"
import Messages from "./messages.component"
import { select } from "Renderer/store"

const mapStateToProps = select(({ messages }) => ({
  list: messages.filteredList,
}))

const mapDispatchToProps = (dispatch: any) => ({
  changeSearchValue: ({ target }: ChangeEvent<HTMLInputElement>) =>
    dispatch.messages.changeSearchValue(target.value),
  changeVisibilityFilter: (filter: VisibilityFilter) =>
    dispatch.messages.changeVisibilityFilter(filter),
})

export default connect(mapStateToProps, mapDispatchToProps)(Messages)
