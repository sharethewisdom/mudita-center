/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React, { useState } from "react"
import { FunctionComponent } from "Core/core/types/function-component.interface"
import {
  FiltersWrapper,
  UnreadFilters,
} from "Core/__deprecated__/renderer/components/rest/messages/threads-table.component"
import ButtonToggler, {
  ButtonTogglerItem,
} from "Core/__deprecated__/renderer/components/core/button-toggler/button-toggler.component"
import { intl } from "Core/__deprecated__/renderer/utils/intl"
import { noop } from "Core/__deprecated__/renderer/utils/noop"
import styled, { css } from "styled-components"
import {
  Call,
  VisibilityFilter,
} from "Core/__deprecated__/renderer/models/calls/calls.interface"
import SelectionManager from "Core/__deprecated__/renderer/components/core/selection-manager/selection-manager.component"
import { UseTableSelect } from "Core/__deprecated__/renderer/utils/hooks/useTableSelect"
import { fadeInAnimation } from "Core/ui/utils/fade-in-animation"
import {
  transitionTime,
  transitionTimingFunction,
} from "Core/core/styles/theming/theme-getters"
import { DisplayStyle } from "Core/__deprecated__/renderer/components/core/button/button.config"
import ButtonComponent from "Core/__deprecated__/renderer/components/core/button/button.component"
import { CallsHeaderTestIds } from "Core/__deprecated__/renderer/components/rest/calls/calls-header-test-ids.enum"
import { IconType } from "Core/__deprecated__/renderer/components/core/icon/icon-type"

const toggleState = [
  {
    label: intl.formatMessage({
      id: "module.phone.callsAllCallTypes",
    }),
    visibilityFilter: VisibilityFilter.All,
  },
  {
    label: intl.formatMessage({
      id: "module.phone.callsReceivedCalls",
    }),
    visibilityFilter: VisibilityFilter.Received,
  },
  {
    label: intl.formatMessage({
      id: "module.phone.callsMissedCalls",
    }),
    visibilityFilter: VisibilityFilter.Missed,
  },
] as const

const CallsButtonTogglerItem = styled(ButtonTogglerItem)`
  width: 12.7rem;
`

const CallsFiltersWrapper = styled(FiltersWrapper)<{
  selectionMode: boolean
}>`
  border-bottom: none;
  padding: 0 0 0 4rem;
  grid-template-areas: "Filters";
  grid-template-columns: auto;
  grid-column-gap: unset;
  ${({ selectionMode }) =>
    selectionMode &&
    css`
      grid-template-areas: "Search";
      max-width: 69.5rem;
    `}
`

const CallsSelectionManager = styled(SelectionManager)`
  animation: ${fadeInAnimation} ${transitionTime("quick")} forwards
    ${transitionTimingFunction("easeInOut")};
  grid-template-columns: 4.8rem 1fr;
  padding: 0 1.6rem;
  button {
    padding: 0 0.8rem;
  }
`

interface Props {
  changeVisibilityFilter?: (filter: VisibilityFilter) => void
  selectedCalls: Call[]
  allRowsSelected?: boolean
  toggleAll?: UseTableSelect<Call>["toggleAll"]
  onDeleteClick: () => void
}

const CallsHeader: FunctionComponent<Props> = ({
  changeVisibilityFilter = noop,
  selectedCalls,
  toggleAll,
  allRowsSelected,
  onDeleteClick,
}) => {
  const [activeLabel, setActiveLabel] = useState(toggleState[0].label)
  const getFilterByLabel = ({
    label,
    visibilityFilter,
  }: {
    label: string
    visibilityFilter: VisibilityFilter
  }) => {
    switch (visibilityFilter) {
      case VisibilityFilter.Received:
        changeVisibilityFilter(VisibilityFilter.Received)
        setActiveLabel(label)
        break
      case VisibilityFilter.Missed:
        changeVisibilityFilter(VisibilityFilter.Missed)
        setActiveLabel(label)
        break
      default:
        changeVisibilityFilter(VisibilityFilter.All)
        setActiveLabel(label)
        break
    }
  }
  const selectionMode = selectedCalls.length > 0

  return (
    <CallsFiltersWrapper selectionMode={selectionMode}>
      {selectionMode ? (
        <CallsSelectionManager
          selectedItemsNumber={selectedCalls.length}
          message={{ id: "module.phone.callsSelectionsNumber" }}
          onToggle={toggleAll}
          allItemsSelected={allRowsSelected}
          buttons={[
            <ButtonComponent
              key="delete"
              label={intl.formatMessage({
                id: "module.templates.deleteButton",
              })}
              displayStyle={DisplayStyle.Link}
              Icon={IconType.Delete}
              onClick={onDeleteClick}
            />,
          ]}
          data-testid={CallsHeaderTestIds.SelectionManager}
        />
      ) : (
        <UnreadFilters data-testid={CallsHeaderTestIds.UnreadFilters}>
          <ButtonToggler>
            {toggleState.map(({ label, visibilityFilter }) => {
              const filter = () => getFilterByLabel({ label, visibilityFilter })
              return (
                <CallsButtonTogglerItem
                  key={visibilityFilter}
                  label={label}
                  onClick={filter}
                  active={activeLabel === label}
                  data-testid={visibilityFilter}
                />
              )
            })}
          </ButtonToggler>
        </UnreadFilters>
      )}
    </CallsFiltersWrapper>
  )
}

export default CallsHeader
