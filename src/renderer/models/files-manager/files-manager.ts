import { Slicer } from "@rematch/select"
import { URL_MAIN } from "Renderer/constants/urls"
import { FilesManagerState } from "Renderer/models/files-manager/files-manager.interface"
import FilesManager from "Renderer/svg/files-manager.svg"
import Mudita from "Renderer/svg/mudita.svg"
import Music from "Renderer/svg/music.svg"
import VoiceRecorder from "Renderer/svg/voice-recorder.svg"

const initialStateValue: FilesManagerState = {
  memoryData: [
    {
      filesType: "Music",
      occupiedMemory: 4294967296,
      filesAmount: 15,
      color: "#6D9BBC",
      icon: Music,
      url: URL_MAIN.music,
    },
    {
      filesType: "Voice Recorder",
      occupiedMemory: 4294967296,
      filesAmount: 3,
      color: "#AEBEC9",
      icon: VoiceRecorder,
      url: "/tools/voice-recorder",
    },
    {
      filesType: "Storage",
      occupiedMemory: 4294967296,
      filesAmount: 85,
      color: "#E3F3FF",
      icon: FilesManager,
    },
    {
      filesType: "Free",
      occupiedMemory: 4294967296,
      color: "#E9E9E9",
      icon: Mudita,
    },
  ],
}

export default {
  state: initialStateValue,
  selectors: (slice: Slicer<typeof initialStateValue>) => ({
    memoryChartData() {
      return slice(state => {
        return state.memoryData
      })
    },
  }),
}