import { Dispatch } from "Renderer/store"
import { getAppSettings } from "Renderer/requests/app-settings.request"
import updateSettingsRequest from "Renderer/requests/update-settings.request"
import { Option } from "Renderer/components/rest/settings/settings-toggler.component"
import { AppSettings as StoreValues } from "App/main/default-app-settings"

export default {
  state: {},
  reducers: {
    update(state: StoreValues, payload: { [key in Option]?: boolean }) {
      return { ...state, ...payload }
    },
  },
  effects: (dispatch: Dispatch) => ({
    async loadSettings() {
      dispatch.settings.update(await getAppSettings())
    },
    async setAutostart(option: boolean) {
      const propertyToUpdate = { [Option.Autostart]: option }
      await updateSettingsRequest(propertyToUpdate)
      dispatch.settings.update(propertyToUpdate)
    },
    async setTethering(option: boolean) {
      const propertyToUpdate = { [Option.Tethering]: option }
      await updateSettingsRequest(propertyToUpdate)
      dispatch.settings.update(propertyToUpdate)
    },
    async setIncomingCalls(option: boolean) {
      const propertyToUpdate = { [Option.IncomingCalls]: option }
      await updateSettingsRequest(propertyToUpdate)
      dispatch.settings.update(propertyToUpdate)
    },
    async setIncomingMessages(option: boolean) {
      const propertyToUpdate = { [Option.IncomingMessages]: option }
      await updateSettingsRequest(propertyToUpdate)
      dispatch.settings.update(propertyToUpdate)
    },
    async setLowBattery(option: boolean) {
      const propertyToUpdate = { [Option.LowBattery]: option }
      await updateSettingsRequest(propertyToUpdate)
      dispatch.settings.update(propertyToUpdate)
    },
    async setOsUpdates(option: boolean) {
      const propertyToUpdate = { [Option.OsUpdates]: option }
      await updateSettingsRequest(propertyToUpdate)
      dispatch.settings.update(propertyToUpdate)
    },
    async setNonStandardAudioFilesConversion(option: boolean) {
      const propertyToUpdate = {
        [Option.NonStandardAudioFilesConversion]: option,
      }
      await updateSettingsRequest(propertyToUpdate)
      dispatch.settings.update(propertyToUpdate)
    },
  }),
}
