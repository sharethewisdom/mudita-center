import SimInfo from "Common/interfaces/sim-info.interface"

export interface NetworkProps {
  simCards?: SimInfo[]
  onSimChange?: (sim: SimInfo) => void
}