import { templates } from "Renderer/components/core/table/table.fake-data"
import { StateProps } from "Renderer/models/templates/templates.interface"
import { Slicer } from "@rematch/select"
import { filterTemplates } from "Renderer/models/templates/filter-templates"

const initialState: StateProps = {
  templates,
  searchValue: "",
}

export default {
  state: initialState,
  reducers: {
    changeSearchValue(
      state: StateProps,
      searchValue: StateProps["searchValue"]
    ) {
      return { ...state, searchValue }
    },
    removeItems(state: StateProps, itemsToRemove: string[]) {
      return {
        ...state,
        templates: templates.filter(({ id }) => !itemsToRemove.includes(id)),
      }
    },
  },
  selectors: (slice: Slicer<StateProps>) => ({
    filteredList() {
      return slice(({ templates: listOfTemplates, searchValue }) => {
        return filterTemplates(listOfTemplates, searchValue)
      })
    },
  }),
}