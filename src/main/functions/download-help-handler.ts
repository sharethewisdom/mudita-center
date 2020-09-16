import { ipcMain } from "electron-better-ipc"
import { HelpActions } from "Common/enums/help-actions.enum"
import { createClient } from "contentful"
import helpStore from "App/main/store/help"
import settingsStore from "App/main/store/settings"
import { normalizeHelpData } from "Renderer/utils/contentful/normalize-help-data"

export const registerDownloadHelpHandler = () => {
  const nextSyncToken =
    helpStore.get("data") &&
    (helpStore.get("data") as Record<string, any>).nextSyncToken
  const locale = settingsStore.get("language")
    ? settingsStore.get("language")?.tag
    : "en-US"
  ipcMain.answerRenderer(HelpActions.DownloadContentfulData, async () => {
    const client = createClient({
      accessToken: process.env.PDA_CONTENTFUL_ACCESS_TOKEN as string,
      space: process.env.PDA_CONTENTFUL_SPACE_ID as string,
      environment: process.env.PDA_CONTENTFUL_ENVIRONMENT_ID,
      host: process.env.PDA_CONTENTFUL_HOST,
    })
    const syncConfig: Record<string, any> = {
      type: "Entry",
      content_type: "helpItem",
      locale,
    }
    if (nextSyncToken) {
      syncConfig.nextSyncToken = nextSyncToken
    } else {
      syncConfig.initial = true
    }
    return normalizeHelpData(await client.sync(syncConfig), locale as string)
  })
}

export const removeDownloadHelpHandler = () =>
  ipcMain.removeHandler(HelpActions.DownloadContentfulData)