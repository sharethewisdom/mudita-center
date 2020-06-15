import React from "react"
import MenuGroup from "Renderer/components/rest/menu/menu-group.component"
import { menuElements } from "Renderer/constants/menu-elements"
import { DevMode } from "Renderer/models/dev-mode/dev-mode.interface"
import styled from "styled-components"
import {
  backgroundColor,
  textColor,
} from "Renderer/styles/theming/theme-getters"
import FunctionComponent from "Renderer/types/function-component.interface"
import Icon from "Renderer/components/core/icon/icon.component"
import { Type } from "Renderer/components/core/icon/icon.config"
import { intl } from "Renderer/utils/intl"

const MenuWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0 3.2rem;
`

const LogoWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: ${backgroundColor("light")};
`

const SvgMuditaLogo = styled(Icon)`
  height: 2rem;
  width: 8.6rem;
  margin: 2rem 0 3.5rem;
`

const DevSign = styled.span`
  position: absolute;
  right: 0;
  top: 2rem;
  line-height: 2rem;
  color: ${textColor("faded")};
`

interface Props extends DevMode {
  deviceDisconnected?: boolean
}

const Menu: FunctionComponent<Props> = ({
  deviceDisconnected,
  devModeEnabled,
}) => {
  const links = menuElements
    .filter(({ visibleWithPhone }) =>
      deviceDisconnected ? visibleWithPhone : true
    )
    .map(({ visibleWithPhone, ...props }, indexMenu) => {
      return <MenuGroup {...props} key={indexMenu} />
    })
  return (
    <MenuWrapper>
      <LogoWrapper>
        <SvgMuditaLogo type={Type.MuditaLogoWithText} />
        {devModeEnabled && (
          <DevSign>{intl.formatMessage({ id: "dev.view.header" })}</DevSign>
        )}
      </LogoWrapper>
      {links}
    </MenuWrapper>
  )
}

export default Menu
