/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React from "react"
import styled from "styled-components"
import { APIFC, IconType, withData } from "generic-view/utils"
import Icon from "../../icon/icon"
import dataTestIds from "./data-test-ids"

interface IconTextRowData {
  icon: IconType
  title: string
  text?: string
}

export const IconText: APIFC<IconTextRowData> = ({ data, ...props }) => {
  if (!data) return null

  const { icon, title, text } = data

  return (
    <IconTextWrapper {...props}>
      <IconWrapper>
        <Icon data={{ type: icon }} />
      </IconWrapper>
      <TextWrapper>
        <TitleText data-testid={dataTestIds.IconTextTitle}>{title}</TitleText>
        {text && (
          <DetailText data-testid={dataTestIds.IconTextDetailText}>
            {text}
          </DetailText>
        )}
      </TextWrapper>
    </IconTextWrapper>
  )
}

export default withData(IconText)

const IconTextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.6rem;
  flex: 0;
  height: 4rem;
`
const IconWrapper = styled.div`
  background-color: ${({ theme }) => theme.color.grey6};
  min-width: 4rem;
  min-height: 4rem;
  max-width: 4rem;
  max-height: 4rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  display: flex;
  justify-content: center;
  align-items: center;
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`

const TitleText = styled.h4`
  font-size: ${({ theme }) => theme.fontSize.headline4};
  font-weight: 700;
  line-height: ${({ theme }) => theme.fontSize.headline4};
  letter-spacing: 0.032rem;
  margin: 0.4rem 0 0 0;
`
const DetailText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.detailText};
  line-height: ${({ theme }) => theme.lineHeight.detailText};
  letter-spacing: 0.048rem;
  color: ${({ theme }) => theme.color.grey2};
`
