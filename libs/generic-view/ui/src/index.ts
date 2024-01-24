/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { blocks } from "./lib/blocks/blocks"
import { rows } from "./lib/data-rows/data-rows"
import { predefinedComponents } from "./lib/predefined/overview-predefined"
import { helpers } from "./lib/helpers/helpers"
import { interactive } from "./lib/interactive/interactive"
import { buttons } from "./lib/buttons/buttons"

export { default as Icon } from "./lib/icon/icon"

const apiComponents = {
  ...predefinedComponents,
  ...blocks,
  ...rows,
  ...helpers,
  ...interactive,
  ...buttons,
}

export default apiComponents

export type APIComponents = typeof apiComponents

export * from "./lib/api-connection-demo"
