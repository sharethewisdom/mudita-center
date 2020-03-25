import * as React from "react"
import { useState } from "react"
import { useEffect } from "react"
import { useLocation } from "react-router"
import Text, {
  TextDisplayStyle,
} from "Renderer/components/core/text/text.component"
import { View, views } from "Renderer/constants/views"
import FunctionComponent from "Renderer/types/function-component.interface"
import styled from "styled-components"
import {
  backgroundColor,
  borderColor,
} from "Renderer/styles/theming/theme-getters"
import Button from "Renderer/components/core/button/button.component"
import { Type } from "Renderer/components/core/icon/icon.config"
import { intl } from "Renderer/utils/intl"

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  background-color: ${backgroundColor("light")};
  border-bottom: 0.1rem solid ${borderColor("app")};
`

interface HeaderProps {
  middleComponent?: any
}

const HeaderText = styled(Text)`
  margin: 2.4rem 0 1.5rem 4rem;
`

const HeaderButton = styled(Button)`
  align-self: center;
  margin-right: 3rem;
  svg {
    height: 1.4rem;
    width: 1.4rem;
  }
`

const Header: FunctionComponent<HeaderProps> = ({ middleComponent }) => {
  const location = useLocation()
  const [currentLocation, setCurrentLocation] = useState()
  const [renderButton, setRenderButton] = useState(false)
  useEffect(() => {
    const pathname = location.pathname
    const currentMenuElementName = Object.keys(views).find(
      key => views[key as keyof typeof views].url === pathname
    )
    if (currentMenuElementName) {
      const currentMenuElement =
        views[currentMenuElementName as keyof typeof views]
      setCurrentLocation(currentMenuElement.label)
    }

    if (currentMenuElementName === View.News) {
      setRenderButton(true)
    } else {
      setRenderButton(false)
    }
  }, [location])
  return (
    <HeaderWrapper>
      <HeaderText
        displayStyle={TextDisplayStyle.TertiaryBoldHeading}
        message={currentLocation}
        data-testid={"location"}
      />
      {middleComponent &&
        React.cloneElement(middleComponent, {
          currentLocation: location.pathname,
        })}
      {renderButton && (
        <HeaderButton
          Icon={Type.More}
          label={intl.formatMessage({
            id: "view.name.news.moreNewsButtonLabel",
          })}
          href={"https://www.mudita.com/"}
          target="_blank"
        />
      )}
    </HeaderWrapper>
  )
}

export default Header
