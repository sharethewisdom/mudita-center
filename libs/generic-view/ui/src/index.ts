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
import { texts } from "./lib/texts"

export { default as Icon } from "./lib/icon/icon"
export * from "./lib/api-connection-demo"
export * from "./lib/interactive/modal/modal"
export * from "./lib/interactive/modal/modal-base"
export * from "./lib/shared/shared"
export * from "./lib/predefined/backup/backup-error"
export * from "./lib/predefined/backup-restore/backup-restore-error"
export * from "./lib/predefined/import-contacts/import-contacts-error"

const apiComponents = {
  ...predefinedComponents,
  ...blocks,
  ...rows,
  ...helpers,
  ...interactive,
  ...buttons,
  ...texts,
}

export default apiComponents

export type APIComponents = typeof apiComponents
