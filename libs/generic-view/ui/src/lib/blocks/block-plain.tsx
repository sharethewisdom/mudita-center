/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React from "react"
import { APIFC } from "generic-view/utils"

export const BlockPlain: APIFC = ({ config, data, ...props }) => {
  return <div {...props} />
}
