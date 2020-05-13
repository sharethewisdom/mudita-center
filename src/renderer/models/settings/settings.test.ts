import { ipcRenderer } from "electron-better-ipc"
import { init } from "@rematch/core"
import settings from "Renderer/models/settings/settings"
import { SettingsEvents } from "App/main/functions/register-settings-listeners"
import { Option } from "Renderer/components/rest/settings/option.enum"
import {
  ConversionFormat,
  Convert,
} from "Renderer/components/rest/settings/audio-conversion-radio-group.enum"

test("loads settings", async () => {
  const store = init({
    models: { settings },
  })
  ;(ipcRenderer as any).__rendererCalls = {
    [SettingsEvents.Get]: Promise.resolve({
      [Option.Autostart]: false,
      [Option.Tethering]: false,
      [Option.IncomingCalls]: false,
      [Option.IncomingMessages]: false,
      [Option.LowBattery]: false,
      [Option.OsUpdates]: false,
      [Option.NonStandardAudioFilesConversion]: false,
      [Option.Convert]: Convert.ConvertAutomatically,
      [Option.ConversionFormat]: ConversionFormat.WAV,
    }),
  }
  await store.dispatch.settings.loadSettings()
  const state = store.getState()
  expect(state).toMatchInlineSnapshot(`
    Object {
      "settings": Object {
        "appAutostart": false,
        "appConversionFormat": "WAV",
        "appConvert": "Convert automatically",
        "appIncomingCalls": false,
        "appIncomingMessages": false,
        "appLowBattery": false,
        "appNonStandardAudioFilesConversion": false,
        "appOsUpdates": false,
        "appTethering": false,
      },
    }
  `)
})

test("updates autostart setting", async () => {
  const store = init({
    models: { settings },
  })
  const updatedOption = { [Option.Autostart]: true }
  ;(ipcRenderer as any).__rendererCalls = {
    [SettingsEvents.Update]: Promise.resolve(updatedOption),
  }
  await store.dispatch.settings.setAutostart(true)
  const state = store.getState()
  expect(state).toMatchInlineSnapshot(`
    Object {
      "settings": Object {
        "appAutostart": true,
      },
    }
  `)
})

test("updates tethering setting", async () => {
  const store = init({
    models: { settings },
  })
  const updatedOption = { [Option.Tethering]: true }
  ;(ipcRenderer as any).__rendererCalls = {
    [SettingsEvents.Update]: Promise.resolve(updatedOption),
  }
  await store.dispatch.settings.setTethering(true)
  const state = store.getState()
  expect(state).toMatchInlineSnapshot(`
    Object {
      "settings": Object {
        "appTethering": true,
      },
    }
  `)
})

test("updates incoming calls setting", async () => {
  const store = init({
    models: { settings },
  })
  const updatedOption = { [Option.IncomingCalls]: true }
  ;(ipcRenderer as any).__rendererCalls = {
    [SettingsEvents.Update]: Promise.resolve(updatedOption),
  }
  await store.dispatch.settings.setIncomingCalls(true)
  const state = store.getState()
  expect(state).toMatchInlineSnapshot(`
    Object {
      "settings": Object {
        "appIncomingCalls": true,
      },
    }
  `)
})

test("updates incoming messages setting", async () => {
  const store = init({
    models: { settings },
  })
  const updatedOption = { [Option.IncomingMessages]: true }
  ;(ipcRenderer as any).__rendererCalls = {
    [SettingsEvents.Update]: Promise.resolve(updatedOption),
  }
  await store.dispatch.settings.setIncomingMessages(true)
  const state = store.getState()
  expect(state).toMatchInlineSnapshot(`
    Object {
      "settings": Object {
        "appIncomingMessages": true,
      },
    }
  `)
})

test("updates low battery setting", async () => {
  const store = init({
    models: { settings },
  })
  const updatedOption = { [Option.LowBattery]: true }
  ;(ipcRenderer as any).__rendererCalls = {
    [SettingsEvents.Update]: Promise.resolve(updatedOption),
  }
  await store.dispatch.settings.setLowBattery(true)
  const state = store.getState()
  expect(state).toMatchInlineSnapshot(`
    Object {
      "settings": Object {
        "appLowBattery": true,
      },
    }
  `)
})

test("updates os updates setting", async () => {
  const store = init({
    models: { settings },
  })
  const updatedOption = { [Option.OsUpdates]: true }
  ;(ipcRenderer as any).__rendererCalls = {
    [SettingsEvents.Update]: Promise.resolve(updatedOption),
  }
  await store.dispatch.settings.setOsUpdates(true)
  const state = store.getState()
  expect(state).toMatchInlineSnapshot(`
    Object {
      "settings": Object {
        "appOsUpdates": true,
      },
    }
  `)
})

test("updates os audio files conversion setting", async () => {
  const store = init({
    models: { settings },
  })
  const updatedOption = { [Option.NonStandardAudioFilesConversion]: true }
  ;(ipcRenderer as any).__rendererCalls = {
    [SettingsEvents.Update]: Promise.resolve(updatedOption),
  }
  await store.dispatch.settings.setNonStandardAudioFilesConversion(true)
  const state = store.getState()
  expect(state).toMatchInlineSnapshot(`
    Object {
      "settings": Object {
        "appNonStandardAudioFilesConversion": true,
      },
    }
  `)
})

test("updates convert setting", async () => {
  const store = init({
    models: { settings },
  })
  const updatedOption = { [Option.Convert]: Convert.ConvertAutomatically }
  ;(ipcRenderer as any).__rendererCalls = {
    [SettingsEvents.Update]: Promise.resolve(updatedOption),
  }
  await store.dispatch.settings.setConvert(Convert.ConvertAutomatically)
  const state = store.getState()
  expect(state).toMatchInlineSnapshot(`
    Object {
      "settings": Object {
        "appConvert": "Convert automatically",
      },
    }
  `)
})

test("updates conversion format setting", async () => {
  const store = init({
    models: { settings },
  })
  const updatedOption = { [Option.ConversionFormat]: ConversionFormat.WAV }
  ;(ipcRenderer as any).__rendererCalls = {
    [SettingsEvents.Update]: Promise.resolve(updatedOption),
  }
  await store.dispatch.settings.setConversionFormat(ConversionFormat.WAV)
  const state = store.getState()
  expect(state).toMatchInlineSnapshot(`
    Object {
      "settings": Object {
        "appConversionFormat": "WAV",
      },
    }
  `)
})