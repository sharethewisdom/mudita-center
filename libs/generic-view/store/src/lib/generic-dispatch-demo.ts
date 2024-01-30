/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

// TODO: demo code, file to be removed
import {
  generateMcAboutLayout,
  generateMcCalendarLayout,
  generateMcDemoLayout,
  generateMcOverviewLayout,
  mcAboutDemoData,
  mcCalendarConfig,
  mcDemoData,
  mcOverviewConfig,
  mcOverviewDemoData,
} from "generic-view/views"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { menuConfig } from "../../../../../demo-data/demo-menu"
import { generateMenu } from "generic-view/utils"
import { setMenu, setViewData, setViewLayout } from "./views/actions"
import { genericViewsReducer } from "./views/reducer"

// For demo purposes to simulate device connection and async data fetching
export const useGenericStoreDemo = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (process.env.FEATURE_TOGGLE_ENVIRONMENT !== "development") {
      return
    }
    void (async () => {
      if (genericViewsReducer.getInitialState().menu) {
        return
      }

      // Simulate menu setup after device connection
      dispatch(setMenu(generateMenu(menuConfig)))

      // Simulate mc-overview layout
      dispatch(
        setViewLayout({
          feature: "mc-overview",
          layout: generateMcOverviewLayout(mcOverviewConfig),
        })
      )

      dispatch(
        setViewLayout({
          feature: "mc-about",
          layout: generateMcAboutLayout({ title: "About" }),
        })
      )

      // Simulate mc-calendar layout
      dispatch(
        setViewLayout({
          feature: "mc-calendar",
          layout: generateMcCalendarLayout(mcCalendarConfig),
        })
      )

      dispatch(
        setViewLayout({
          feature: "mc-demo",
          layout: generateMcDemoLayout({ title: "Demo" }),
        })
      )

      dispatch(
        setViewData({
          feature: "mc-demo",
          data: mcDemoData,
        })
      )

      dispatch(
        setViewData({
          feature: "mc-overview",
          data: mcOverviewDemoData,
        })
      )

      dispatch(
        setViewData({
          feature: "mc-about",
          data: mcAboutDemoData,
        })
      )
    })()
  }, [dispatch])
}