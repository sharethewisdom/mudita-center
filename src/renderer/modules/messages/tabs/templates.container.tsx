import { ChangeEvent } from "react"
import { connect } from "react-redux"
import { select, Dispatch } from "Renderer/store"
import Templates, {
  Template,
} from "Renderer/modules/messages/tabs/templates.component"
import { TemplateCallback } from "Renderer/models/templates/templates"
import { RootModel } from "Renderer/models/models"

const selector = select(({ templates }) => ({
  templates: templates.filteredList,
}))

const mapStateToProps = (state: RootModel) => ({
  ...state.templates,
  ...selector(state, {}),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  toggleSortOrder: () => dispatch.templates.toggleSortOrder(),
  onSearchTermChange: ({ target }: ChangeEvent<HTMLInputElement>) =>
    dispatch.templates.changeSearchValue(target.value),
  newTemplate: (template: TemplateCallback) =>
    dispatch.templates.createNewTemplate(template),
  saveTemplate: (template: Template) =>
    dispatch.templates.saveTemplate(template),
  onDeleteButtonClick: (payload: string[]) =>
    dispatch.templates.removeItems(payload),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps as Dispatch
)(Templates)
