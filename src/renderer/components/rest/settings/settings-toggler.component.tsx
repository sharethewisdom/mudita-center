import React from "react"
import FunctionComponent from "Renderer/types/function-component.interface"
import { intl } from "Renderer/utils/intl"
import styled from "styled-components"
import ButtonToggler, {
  ButtonTogglerItem,
} from "Renderer/components/core/button-toggler/button-toggler.component"
import { twoStateToggler } from "Renderer/modules/settings/settings-toggler-state"
import { noop } from "Renderer/utils/noop"

const Toggler = styled(ButtonToggler)`
  margin-right: 4rem;
`

const TogglerItem = styled(ButtonTogglerItem)`
  padding: 0 3.6rem;
  width: 75%;
`

interface Props {
  toggleValue?: boolean
  onToggle?: (option: boolean) => void
}

const SettingsToggler: FunctionComponent<Props> = ({
  toggleValue,
  onToggle = noop,
}) => {
  return (
    <Toggler filled>
      {twoStateToggler.map(value => {
        const changeStatus = () => {
          onToggle(value)
        }
        return (
          <TogglerItem
            key={Number(value)}
            label={intl.formatMessage({
              id: Boolean(value)
                ? "view.name.settings.onLabel"
                : "view.name.settings.offLabel",
            })}
            onClick={changeStatus}
            active={toggleValue === value}
            data-testid={
              toggleValue === value ? "toggler-active" : "toggler-inactive"
            }
          />
        )
      })}
    </Toggler>
  )
}

export default SettingsToggler