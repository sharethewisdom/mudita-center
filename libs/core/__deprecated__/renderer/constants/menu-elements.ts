/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { DeviceType } from "Core/device/constants"
import { defineMessages } from "react-intl"
import { View, views } from "Core/__deprecated__/renderer/constants/views"
import { MenuGroupTestIds } from "Core/__deprecated__/renderer/components/rest/menu/menu-group-test-ids.enum"
import { Feature, flags } from "Core/feature-flags"
import { IconType } from "Core/__deprecated__/renderer/components/core/icon/icon-type"

const messages = defineMessages({
  yourPure: { id: "component.menuHeaderYourPure" },
  yourHarmony: { id: "component.menuHeaderYourHarmony" },
  desktopApp: { id: "component.menuHeaderDesktopApp" },
})

const YOUR_PURE_BUTTONS = [
  {
    button: views.overview,
    icon: IconType.MenuOverview,
    testId: MenuGroupTestIds.Overview,
    visibleOn: [DeviceType.MuditaPure, DeviceType.MuditaHarmony],
    viewKey: View.Overview,
  },
  {
    button: views.messages,
    icon: IconType.Message,
    testId: MenuGroupTestIds.Messages,
    visibleOn: [DeviceType.MuditaPure],
    viewKey: View.Messages,
  },
  {
    button: views.phone,
    icon: IconType.MenuPhone,
    testId: MenuGroupTestIds.Phone,
    hidden: !flags.get(Feature.PhoneTabEnabled),
    visibleOn: [DeviceType.MuditaPure],
    viewKey: View.Phone,
  },
  {
    button: views.contacts,
    icon: IconType.MenuContacts,
    testId: MenuGroupTestIds.Contacts,
    visibleOn: [DeviceType.MuditaPure],
    viewKey: View.Contacts,
  },
  {
    button: views.tools,
    icon: IconType.MenuTools,
    testId: MenuGroupTestIds.Tools,
    hidden: !flags.get(Feature.ToolsTabEnabled),
    visibleOn: [DeviceType.MuditaPure],
    viewKey: View.Tools,
  },
  {
    button: views.music,
    icon: IconType.MenuMusic,
    testId: MenuGroupTestIds.Music,
    hidden: !flags.get(Feature.MusicTabEnabled),
    visibleOn: [DeviceType.MuditaPure],
    viewKey: View.Music,
  },
  {
    button: views.filesManager,
    icon: IconType.MenuFilesManager,
    testId: MenuGroupTestIds.FilesManager,
    visibleOn: [DeviceType.MuditaPure, DeviceType.MuditaHarmony],
    viewKey: View.FilesManager,
  },
]

const DESKTOP_APP_BUTTONS: Item[] = [
  {
    button: views.settings,
    icon: IconType.MenuSettings,
    visibleOn: [
      DeviceType.MuditaPure,
      DeviceType.MuditaHarmony,
      DeviceType.APIDevice,
    ],
  },
  {
    button: views.help,
    icon: IconType.MenuHelp,
    testId: MenuGroupTestIds.Help,
    visibleOn: [
      DeviceType.MuditaPure,
      DeviceType.MuditaHarmony,
      DeviceType.APIDevice,
    ],
  },
]

interface Item {
  button: (typeof views)[View]
  icon?: IconType
  testId?: MenuGroupTestIds
  hidden?: boolean
  visibleOn?: DeviceType[]
  viewKey?: View
}

export interface MenuElement {
  items?: Item[]
  label?:
    | {
        id: string
      }
    | string
  icons?: IconType[]
  connectedPhoneOnly?: boolean
  devModeOnly?: boolean
  simulatePhoneConnection?: boolean
  openHelpWindow?: () => void
  visibleOn?: DeviceType[]
  viewKey?: View
}

export const baseMenuElements: MenuElement[] = [
  {
    items: [
      {
        button: views[View.Connecting],
        icon: IconType.Send,
        testId: MenuGroupTestIds.Connecting,
        visibleOn: [DeviceType.MuditaPure, DeviceType.MuditaHarmony],
      },
    ],
    viewKey: View.Connecting,
    simulatePhoneConnection: true,
  },
  {
    items: [
      {
        button: views[View.Onboarding],
        icon: IconType.Send,
        visibleOn: [DeviceType.MuditaPure, DeviceType.MuditaHarmony],
      },
    ],
    viewKey: View.Onboarding,
    devModeOnly: true,
  },
  {
    items: [
      {
        button: views[View.News],
        icon: IconType.MenuNews,
        visibleOn: [
          DeviceType.MuditaPure,
          DeviceType.MuditaHarmony,
          DeviceType.APIDevice,
        ],
      },
    ],
    viewKey: View.News,
  },
]

export const deviceMenuElements: MenuElement[] = [
  {
    label: messages.yourPure,
    items: YOUR_PURE_BUTTONS,
    icons: flags.get(Feature.YourPureIconsEnabled)
      ? [
          IconType.MenuRange,
          IconType.MenuBattery,
          IconType.Sim,
          IconType.TetheringStatus,
        ]
      : [],
    connectedPhoneOnly: true,
    visibleOn: [DeviceType.MuditaPure],
  },
  {
    label: messages.yourHarmony,
    items: YOUR_PURE_BUTTONS,
    icons: [],
    connectedPhoneOnly: true,
    visibleOn: [DeviceType.MuditaHarmony],
  },
]

export const centerMenuElements: MenuElement[] = [
  {
    label: messages.desktopApp,
    items: DESKTOP_APP_BUTTONS,
  },
]
