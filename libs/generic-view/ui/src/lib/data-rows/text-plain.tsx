/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React from "react"
import styled from "styled-components"
import { APIFC } from "generic-view/utils"
import { TextPlainData } from "generic-view/models"

export const TextPlain: APIFC<TextPlainData> = ({ data }) => {
  return <Paragraph>{data?.text}</Paragraph>
}

const Paragraph = styled.article`
  font-size: ${({ theme }) => theme.fontSize.paragraph1};
  line-height: ${({ theme }) => theme.lineHeight.paragraph1};
  color: ${({ theme }) => theme.color.black};
  letter-spacing: 0.07rem;
  white-space: pre-wrap;
`
